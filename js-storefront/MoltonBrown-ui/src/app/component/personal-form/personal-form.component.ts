import { Component,NgZone, OnInit,Input,Output,EventEmitter ,OnChanges,SimpleChange,ElementRef,ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import {countries} from '../../app.constant';
import { FormBuilder,FormGroup } from '@angular/forms';
import {RegistrationForm } from '../../forms/registration.form';
import {profileComponentService} from '../profile-form/profile.service';
import * as _ from 'lodash';
import {SingletonService} from '../../services/singleton.service';

import {PlacePredictionService} from '../../services/postcode-prediction.service';
declare const google: any;
@Component({
  selector: 'app-personal-form',
  templateUrl: './personal-form.component.html',
  styleUrls: ['./personal-form.component.scss']
})
export class PersonalFormComponent implements OnInit, OnChanges {
  @ViewChild("search")
  public searchElementRef: ElementRef;
  registrationForm:FormGroup;
  @Input() profileData:any;
  @Output() cancelUpdate : EventEmitter<any> = new EventEmitter<any>();
  countries:Array<any>=countries;
  emailPattern:'^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$';
  postalAddresses:Array<any>;
  loading:boolean;
  postCodeStatus:boolean;
  searchTerm:string;
    constructor(private zone: NgZone,public location: Location,public router: Router,public route :ActivatedRoute,public singletonServ:SingletonService,
    public customerForm:RegistrationForm,private fb: FormBuilder,public profileServ:profileComponentService) {
    this.loading=false;
    this.postCodeStatus=true;
  }
  ngOnInit() {
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange })  {    
    const that=this;
    if (changes['profileData']){
      if (changes['profileData']['currentValue'] != undefined){
         that.registrationForm = that.fb.group(that.customerForm.profileForm());
         that.registrationForm.patchValue(changes['profileData']['currentValue']);
         const country= {name: "United Kingdom", isocode: "GB"};
         that.registrationForm.controls['country'].patchValue(country);
       }
    }
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
onSubmitForm(event){
    event.stopPropagation();
    this.loading=true;
    const that=this;
    const email =this.registrationForm.value.uid;
     const user= this.registrationForm.value

    const cVrsnid = this.singletonServ.catalogVersionId;
    that.profileServ.generateToken().subscribe((token)=>{ 
        const tokenId=token['access_token'];
        const _body={
          "firstName": user.firstName,
          "lastName": user.lastName,
          "titleCode": user.titleCode
          
        }
       that.profileServ.updateProfile(cVrsnid,tokenId,email,_body).subscribe((resp)=>{
         const addressId=that.profileData.id;
         this.cancelUpdate.emit();
         const _address={
          "country": {
            "isocode": user.country.isocode
          },
          "firstName": user.firstName,
          "postalCode": user.postalCode,//"55446-3739"
          "town": user.town,
          "lastName": user.lastName,
          "phone": user.phone,
          "line1": user.line1,
          "line2": user.line2,
          "titleCode": user.titleCode
        };
           that.profileServ.updateProfileAddress(cVrsnid,tokenId,email,addressId,_address).subscribe((address)=>{

           },(err)=>{

           });
       },(err)=>{

       });
    },(err)=>{
     
    });
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
  onUpdate(){
    this.cancelUpdate.emit();

  }
}
