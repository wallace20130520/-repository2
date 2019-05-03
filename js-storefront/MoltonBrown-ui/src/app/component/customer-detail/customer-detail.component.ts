import { Component, OnInit } from '@angular/core';
import {RegistrationForm} from '../../forms/registration.form';
import { FormBuilder,FormGroup } from '@angular/forms';
import { profileComponentService } from '../profile-form/profile.service';
import {SingletonService} from '../../services/singleton.service';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {
  updateForm:FormGroup;
  registrationForm:FormGroup;
  updateProfile:boolean;
  user:any;
  customerId:string;
  profileData:any;
  constructor(public singletonServ:SingletonService, public customerForm:RegistrationForm,private fb: FormBuilder,public profilServ:profileComponentService,public router: Router,public route :ActivatedRoute) { 
    this.updateProfile=true;
    this.updateForm = this.fb.group(customerForm.updatePassword());
    this.registrationForm = this.fb.group(customerForm.addressForm());
  }
  ngOnInit() {
    if(sessionStorage.getItem('customerToken')){
      const user=JSON.parse(sessionStorage.getItem('customerToken'));
      const email =user.email;
      this.getUserData(email);
    }
  }
  getUserData(id){
    const cVrsnid = this.singletonServ.catalogVersionId;
    const that =this;

      that.profilServ.generateToken().subscribe((resp)=>{ 
        const tokenId=resp['access_token'];
        that.fetchUserData(cVrsnid,tokenId,id);
      },error=>{

      });
    
  }
  fetchUserData(cVrsnid,tokenId,id){
    this.profilServ.getUserData(cVrsnid,tokenId,id).subscribe((resp)=>{
      this.user=resp;
    },(error)=>{

    });
  }
  OnUpdateProfile(data){
    let _user=this.user;
    let defaultAddress =this.user.defaultAddress;
    let _address =undefined;
    if(defaultAddress){
    delete defaultAddress['firstName'];
    delete defaultAddress['lastName']; 
     _address = Object.assign({},_user,defaultAddress);
     _address['address']='';
     _address['County']='';
     _address['age']='';
     _address['uid']=_user.displayUid;
     this.profileData=_address;
     this.customerId=this.user.defaultAddress.id;
     this.updateProfile=false;
    }
   
   
  }
  OnUpdateCardDetails(){
    
    this.router.navigate(['store','myaccount','profile','paymentInfo']);
  
  }
  OnUpdateAddress(){
    
    this.router.navigate(['store','myaccount','profile','addressBook']);
  
  }
  cancelUpdate(bol){
    if(sessionStorage.getItem('customerToken')){
      const user=JSON.parse(sessionStorage.getItem('customerToken'));
      const email =user.email;
      this.getUserData(email);
    }
      this.updateProfile=true;  
  }
}