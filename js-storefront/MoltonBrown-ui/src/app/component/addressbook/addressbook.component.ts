import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import {profileComponentService} from '../profile-form/profile.service';
import {RegistrationForm} from '../../forms/registration.form';
import { FormBuilder,FormGroup } from '@angular/forms';
import {SingletonService} from '../../services/singleton.service';
@Component({
  selector: 'app-addressbook',
  templateUrl: './addressbook.component.html',
  styleUrls: ['./addressbook.component.scss'],  
  encapsulation: ViewEncapsulation.None
})
export class AddressbookComponent implements OnInit {
  updateProfile:boolean;
  addressList:Array<any>;
  registrationForm:FormGroup;
  customerId:string;
  constructor(public profileServ:profileComponentService,private fb: FormBuilder,public customerForm:RegistrationForm,public singletonServ:SingletonService) {
    this.registrationForm = this.fb.group(customerForm.addressForm());
    this.updateProfile=true;
   }

  ngOnInit() {
    this.getUserAddresses();
  }
  getUserAddresses(){
    const that=this;
    const cVrsnid = this.singletonServ.catalogVersionId;
    if(sessionStorage.getItem('customerToken')){
       const data =JSON.parse(sessionStorage.getItem('customerToken'));
        that.profileServ.getUserAddress(cVrsnid,data.token,data.email).subscribe((resp)=>{
          that.addressList=resp['addresses'];
        });
    }
  }
  onRemoveAddress(data){
    const that=this;
    const cVrsnid = this.singletonServ.catalogVersionId;
    if(sessionStorage.getItem('customerToken')){
      const user=JSON.parse(sessionStorage.getItem('customerToken'));
      const email =user.email;
      const id=this.customerId;
      const iso= {
        "isocode": 'GB'
      }
that.profileServ.generateToken().subscribe((token)=>{
const tokenId=token['access_token'];
      that.profileServ.spliceUserAddress(cVrsnid,tokenId,email,data.id)
       .subscribe((response)=>{
         that.getUserAddresses();
        },(error)=>{
        
        });
        
},(error)=>{

});
  }
  }
  onSetDefaultAddress(data){
    const that=this;
    const cVrsnid = this.singletonServ.catalogVersionId;
    if(sessionStorage.getItem('customerToken')){
      const user=JSON.parse(sessionStorage.getItem('customerToken'));
      const email =user.email;
       data['defaultAddress']=true;
      that.profileServ.generateToken().subscribe((token)=>{
        const tokenId=token['access_token'];
        that.profileServ.updateUserAddress(cVrsnid,data,tokenId,email,data.id)
        .subscribe((response)=>{
           that.getUserAddresses();
        },(error)=>{
        
        })
      },(err)=>{

      })
  }
  }
  onEditAddress(data){
   this.updateProfile=false;
   this.customerId=data.id;
   this.registrationForm.patchValue(data);
  }
  cancelUpdate(bol){
    this.registrationForm.reset();
    this.updateProfile=true;
    if(bol){
      this.getUserAddresses();
    }
  }
}
