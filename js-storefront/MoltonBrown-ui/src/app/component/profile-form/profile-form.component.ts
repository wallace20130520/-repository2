import { Component, OnInit,NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import {countries} from '../../app.constant';
import { FormBuilder,FormGroup } from '@angular/forms';
import {RegistrationForm } from '../../forms/registration.form';
import {profileComponentService} from './profile.service';
import * as _ from 'lodash';
import {SingletonService} from '../../services/singleton.service';
import {PlacePredictionService} from '../../services/postcode-prediction.service';
declare const google: any;
@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {
  breadcrumb:Array<any>;
  countries:Array<any>=countries;
  registrationForm:FormGroup;
  emailPattern:'^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$';
  loading:boolean;
  postalAddresses:Array<any>;
  postCodeStatus:boolean;
  searchTerm:string;
  constructor(private zone: NgZone,public location: Location,public router: Router,public route :ActivatedRoute,public singletonServ:SingletonService,
    public customerForm:RegistrationForm,private fb: FormBuilder,public profileServ:profileComponentService) {
      this.postCodeStatus=true;
    this.registrationForm = this.fb.group(customerForm.getForm());
    const country= _.find(this.countries, function(o) { return o['name']= "United Kingdom" });
    this.registrationForm.controls['country'].patchValue(country);
    this.loading=false;

    
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
  onSubmitForm(event,bol){
    event.stopPropagation();
    const that=this;
    const email =this.registrationForm.value.uid;
    const user= this.registrationForm.value;
   if(this.registrationForm.valid&&bol){
    this.loading=true;   
    const _userBody={
      "uid": user.uid,
      "password": user.password,
      "firstName": user.firstName,
      "lastName": user.lastName,
      "titleCode": user.titleCode      
    };
    const _address={
      "country": {
        "isocode": 'GB'
      },
      "type": "Home",
      "firstName": user.firstName,
      "postalCode": user.postalCode,//"55446-3739"
      "town": user.town,
      "lastName": user.lastName,
      "phone": user.phone,
      "line1": user.line1,
      "line2": user.line2,
      "companyName": "",
      "shippingAddress": true,
      "visibleInAddressBook": false,
      "fpo": false,
      "recordType": "S",
      "titleCode": user.titleCode
    };
    const cVrsnid = this.singletonServ.catalogVersionId;
    that.profileServ.generateToken().subscribe((resp)=>{ 
        const tokenId=resp['access_token'];
        that.profileServ.createUser(cVrsnid,_userBody,tokenId).subscribe((resp)=>{
             that.profileServ.createUserAddress(cVrsnid,_address,tokenId,email).subscribe((response)=>{
            alert('register success');
            this.loading=false;
              that.router.navigate(['store/myacc/mbLogin']);
            },(error)=>{

             })
        },(err)=>{
          alert('register failure');
          this.loading=false;
          
        })
    },(err)=>{
     
    });
  }else{

  }
  }
  onLookupAddress(event){
    this.findAddress(event);
   }
   
   findAddress(event){
     event.stopPropagation();
     const that =this;
     const val=this.registrationForm.value;
     const postcode=val['postalCode'];
     that.profileServ.getPostCode(postcode).subscribe((response)=>{
      if(response["Items"][0]["Error"]){
        this.postCodeStatus=false;
      }else{
        this.postCodeStatus=true;
        that.postalAddresses=response['Items'];  
      }
      
   
     },(error)=>{
   
     });
   
   }
   onSelectPlace(val){
     const that=this;  
     const id=val;
     this.profileServ.retrievePostalAddress(id).subscribe((resp)=>{
       that.postalAddresses=undefined;
       let _addresses=resp['Items'][0];
     
       that.registrationForm.controls['town'].setValue(_addresses['PostTown']);
     
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
  onChange(data){
  }
}
