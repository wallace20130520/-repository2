import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {GuestForm } from '../../forms/guestForm.form';
import {profileComponentService} from '../../component/profile-form/profile.service';
import {SingletonService} from '../../services/singleton.service';
import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'app-checkout-regitstration',
  templateUrl: './checkout-regitstration.component.html',
  styleUrls: ['./checkout-regitstration.component.scss']
})
export class CheckoutRegitstrationComponent implements OnInit {
  guestForm:FormGroup;
  emailPattern:'^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$';
  showCredenialError:boolean;
  constructor(public location: Location,public router: Router,public route :ActivatedRoute,public singletonServ:SingletonService,
    public customerForm:GuestForm,private fb: FormBuilder,public profileServ:profileComponentService) { 
    this.showCredenialError=false;
    this.guestForm = this.fb.group(customerForm.getForm());
    this.guestForm.controls['password'].setValidators([Validators.required]);
  }

  ngOnInit() {
  }
  onChangePreference(status){
    if(status.target.value=='guest'){
       this.guestForm.controls['password'].setValidators(null);
       this.guestForm.controls['password'].updateValueAndValidity();
     }else{
       this.guestForm.controls['password'].setValidators([Validators.required]);
       this.guestForm.controls['password'].updateValueAndValidity();
    }
 }
 oncheckoutContinue(){
   sessionStorage.setItem("guest", JSON.stringify(this.guestForm.getRawValue()));
   this.router.navigate(['/checkout','shopping']);
 }
 isFieldValid(field: string) {
   return (!this.guestForm.get(field).valid && this.guestForm.get(field).touched) 
 }
 getPatternCheck(){}
 onSubmitForm(event){
  const cVrsnid = this.singletonServ.catalogVersionId;
   const that =this;
   let _form =this.guestForm.value;
   let _userForm={
    email:_form.email,
    password:_form.password
   };
   if (sessionStorage.getItem('cartGUID')) {
    const guidData = JSON.parse(sessionStorage.getItem('cartGUID'));
    
   if(_form.saveGuest == 'guest'){
          that.profileServ.siteanonymousAuth(cVrsnid,guidData,_form).subscribe((response)=>{
            guidData['email']=_form['email'];
            sessionStorage.setItem('cartGUID',JSON.stringify(guidData));
            that.router.navigate(['checkout','shipping']);
          },(error)=>{
           const err=error.error["errors"][0];
           if(err['type']=='InvalidTokenError'){
             that.profileServ.generateToken().subscribe((resp)=>{
                guidData['tokenId']=resp['access_token'];
                
              that.profileServ.siteanonymousAuth(cVrsnid,guidData,_form).subscribe((response)=>{
                guidData['email']=_form['email'];
                guidData['guid']=resp['guid'];
                sessionStorage.setItem('cartGUID',JSON.stringify(guidData));
                that.router.navigate(['checkout','shipping']);
     
                this.singletonServ.setCookie("guestUser", JSON.stringify(guidData), 1); 
              },(error)=>{
           
              });
             },(err)=>{

             })
           }
          });

   }else{
    this.profileServ.siteAuthentication(cVrsnid,_userForm).subscribe((user)=>{
      this.showCredenialError=false;
      const data ={};
      const obj={
        access_token:user['access_token'],
        email:_userForm.email
      };
       sessionStorage.setItem('customerToken', JSON.stringify(obj));
       that.profileServ.creatEmptyCart(cVrsnid,guidData['tokenId'],data,_form.email).subscribe((res)=>{
         that.createCurrentUserCart(cVrsnid,data,_form.email,guidData['tokenId'],guidData['guid'],res['guid']);
         
         
 
       },(err)=>{

       });
   
          },(error)=>{
            this.showCredenialError=true;
          });
   }
  }
 }
 createCurrentUserCart(cVrsnid,body,_email,token,oldCartId,newCartId){
   const that=this;
   let _token =token;
   let data = JSON.parse(sessionStorage.getItem('customerToken'));
   data['token']=_token;
   that.profileServ.mergeCart(cVrsnid,body,_email,_token,oldCartId,newCartId).subscribe((resp)=>{
  data['guid']=resp['guid'];
  data['code']=resp['code'];
  sessionStorage.setItem('customerToken', JSON.stringify(data));  
  that.singletonServ.setCookie("user", JSON.stringify(data), 1); 
  const obj = { updateCart: true };
  that.singletonServ.sendMessage(obj);
  that.router.navigate(['checkout','shipping']);
},(err)=>{

});
     

 }
}
