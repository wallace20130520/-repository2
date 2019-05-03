import { Component,NgZone, OnInit,Output ,Input,OnChanges,SimpleChange,EventEmitter,ViewChild,ElementRef} from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Location } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import {countries} from '../../app.constant';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {RegistrationForm } from '../../forms/registration.form';
import {profileComponentService} from '../profile-form/profile.service';
import * as _ from 'lodash';
import {SingletonService} from '../../services/singleton.service';
import {PlacePredictionService} from '../../services/postcode-prediction.service';
declare const google: any;
@Component({
  selector: 'app-customer-profile-form',
  templateUrl: './customer-profile-form.component.html',
  styleUrls: ['./customer-profile-form.component.scss']
})
export class CustomerProfileFormComponent implements OnInit,OnChanges {
  @ViewChild("search")
  public searchElementRef: ElementRef;
  @Input() registrationForm:FormGroup;
  @Input() customerId:string;
  @Input() updateAddress:boolean;
  @Output() cancelUpdate : EventEmitter<any> = new EventEmitter<any>();
  breadcrumb:Array<any>;
  countries:Array<any>=countries;
  addressId:string;
  postalAddresses:Array<any>;
  emailPattern:'^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$';
  postalCodeEntry:boolean;
  postCodeStatus:boolean;
  searchTerm:string;
  results:any;
  constructor(private zone: NgZone,public singletonServ:SingletonService,public location: Location,public router: Router,public route :ActivatedRoute,
              public customerForm:RegistrationForm,private fb: FormBuilder,public profileServ:profileComponentService,
              private mapsAPILoader: MapsAPILoader,private placePredictionService: PlacePredictionService) {
                this.postCodeStatus=true;
   }

  ngOnInit() {
    this.breadcrumb=['MY ACCOUNT',' MY PROFILE'];
  }
  setAddress(addrObj) {
    const that=this;
    this.zone.run(() => {
     that.registrationForm.controls['postalCode'].setValue(addrObj.postal_code);
    });
  }
  onSearchKeyUp(event){
    const term=event.target.value;
    console.log(term);
    this.searchTerm = term;
    if (this.searchTerm === '') return;
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange })  {    
    const that=this;
    if (changes['registrationForm']){
      if (changes['registrationForm']['currentValue'] != undefined){
         that.registrationForm =changes['registrationForm']['currentValue'];
         const country= _.find(that.countries, function(o) { return o['name']= "United Kingdom" });
         that.registrationForm.controls['country'].patchValue(country);
       }
    }
    if (changes['customerId']){
      if (changes['customerId']['currentValue'] != undefined){
        console.log(changes['customerId']['currentValue']);
         this.addressId=changes['customerId']['currentValue'];
       }
    }
}
  onSubmitForm(event,boolean){
    event.stopPropagation();
    event.preventDefault();
    const that=this;
   const user= this.registrationForm.value;
   this.postalCodeEntry=boolean;
   if(this.postalCodeEntry){
   if(this.registrationForm.valid){
    const _userBody={
      "uid": user.uid,
      "password": user.password,
      "firstName": user.firstName,
      "lastName": user.lastName,
      "titleCode": user.titleCode
      
    };
    const _address={
      "country": {
        "isocode": user.country.code
      },
      "type": "Home",
      "firstName": user.firstName,
      "postalCode": user.postalCode,//"55446-3739"
      "town": user.town,
      "lastName": user.lastName,
      "phone": user.phone,
      "line1": user.line1,
      "line2": user.line2,
      "visibleInAddressBook": false,
      "titleCode": user.titleCode
    };
    const cVrsnid = this.singletonServ.catalogVersionId;

    if(sessionStorage.getItem('customerToken')){
      const user=JSON.parse(sessionStorage.getItem('customerToken'));
      const email =user.email;

    that.profileServ.generateToken().subscribe((resp)=>{ 
      const tokenId=resp['access_token'];
      if(!that.updateAddress){
        const _address=that.registrationForm.value;
        const data={
          "country": {
            "isocode": _address.country.isocode
          },
          "type": "Home",
          "firstName": _address.firstName,
          "postalCode": _address.postalCode,//"55446-3739"
          "town": _address.town,
          "lastName": _address.lastName,
          "phone": _address.phone,
          "line1": _address.line1,
          "line2": _address.line2
        };
        data["titleCode"]= 'mrs';
                  that.profileServ.createUserAddress(cVrsnid,data,tokenId,email).subscribe((response)=>{
                    that.cancelUpdate.emit(true);
                  },(error)=>{

                  });

      }else{

          const id=this.customerId;
          const iso= {
            "isocode": 'GB'
          }
          _address['country']=iso;
          _address['titleCode']='mrs';
          delete  _address['defaultAddress'];
          that.profileServ.updateUserAddress(cVrsnid,_address,tokenId,email,id)
           .subscribe((response)=>{
             that.cancelUpdate.emit(true);
            },(error)=>{
            
            })
      
    }
    },(err)=>{

    });
  }
}
   }else{
    that.registrationForm.controls['line1'].patchValue(['']);
    that.registrationForm.controls['city'].setValue('');
    that.findAddress(event);
 }
}

  findAddress(event){
    event.preventDefault();
    const that =this;
    const val=this.registrationForm.value;
    const postcode=val['postalCode'];
    that.profileServ.getPostCode(postcode).subscribe((response)=>{
      
      if(response["Items"][0]["Error"]){
        this.postCodeStatus=false;
      }else{
        this.postCodeStatus=true;
        this.registrationForm.controls['address'].setValidators([Validators.required]);
        this.registrationForm.controls['address'].updateValueAndValidity();
        that.postalAddresses=response['Items'];  
      }


  
    },(error)=>{
  
    });
  
  }
  onChange(data){
  }
  onUpdate(){
    if(this.updateAddress){
    this.cancelUpdate.emit(false);
  }else{
    this.registrationForm.reset();
  }
  }
  onSelectPlace(val){
    const that=this;  
    const id=val;
    this.profileServ.retrievePostalAddress(id).subscribe((resp)=>{
      that.postalAddresses=undefined;
      let _addresses=resp['Items'][0];
      that.registrationForm.controls['city'].setValue(_addresses['PostTown']);
    
      if(_addresses['Company'].length==0){
       that.registrationForm.controls['line1'].setValue(_addresses['Line1']);
       that.registrationForm.controls['line2'].setValue(_addresses['Line2']);
     }else{
      that.registrationForm.controls['line1'].setValue(_addresses['Company']);
      that.registrationForm.controls['line2'].setValue(_addresses['Line1']);
     }
     that.registrationForm.controls['postalCode'].setValue(_addresses['Postcode']);
     that.registrationForm.controls['County'].setValue(_addresses['County']);
  },(err)=>{
  
    });
  
  }
}
