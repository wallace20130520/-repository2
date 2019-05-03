import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { Router} from '@angular/router';
import {profileComponentService} from '../profile-form/profile.service';
import {GuestForm } from '../../forms/guestForm.form';
import { FormBuilder,FormGroup } from '@angular/forms';
import {SingletonService} from '../../services/singleton.service';
import {AuthenticationService} from '../../services/authentication.service';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],  
  encapsulation: ViewEncapsulation.None
})
export class RegistrationComponent implements OnInit {
  breadcrumb:Array<any>;
  authForm:FormGroup;
  loading:boolean;
  showCrentialError:boolean;
  constructor(public router: Router,public customerForm:GuestForm,private fb: FormBuilder,
    public profileServ:profileComponentService,public singletonServ:SingletonService,private _authService: AuthenticationService) {
    this.authForm = this.fb.group(customerForm.authenticationForm());
    this.showCrentialError=false;
  }
  ngOnInit() {
    this.breadcrumb=['MY ACCOUNT',' MY PROFILE'] 
  }
  onShowRegisterForm(){
    this.router.navigate(['store','myacc','mbRegister']);
  }
  onSubmitForm(event){
    event.stopPropagation();
    const that =this;
    const cVrsnid = this.singletonServ.catalogVersionId;
    const _userForm= this.authForm.value;
    this.loading=true;
    that.profileServ.siteAuthentication(cVrsnid,_userForm).subscribe((resp)=>{
      that.showCrentialError=false;
        const obj={
          access_token:resp['access_token'],
          email:_userForm.email
        };
        that.profileServ.generateToken().subscribe((resp)=>{
          obj['token']=resp['access_token'];
          sessionStorage.setItem('customerToken',JSON.stringify(obj));
          that.fetchRelavantBasket(obj);
          that.getFavourites(cVrsnid,resp['access_token'],_userForm);
          that.router.navigate(['store','myaccount','profile','detail']);
        },(error)=>{
          
          this.loading=false;
        });    
       
    },(error)=>{
      that.showCrentialError=true;
    });
  }
  getFavourites(baseSite,token,user){
    const that=this;
    this.profileServ.getFavourites(baseSite,token,user.email).subscribe((response)=>{
      console.log(response);
     that.singletonServ.favourites=response['products'];
    },(error)=>{

    });
  }
  fetchRelavantBasket(data){
    const that=this;
    const baseSiteid =this.singletonServ.catalogVersionId;
    const _emptyObj={};
    
    if(sessionStorage.getItem('cartGUID')){   
            that.profileServ.creatEmptyCart(baseSiteid,data.token,_emptyObj,data.email).subscribe((emptyCart)=>{
             
                const  guidData =JSON.parse(sessionStorage.getItem('cartGUID'));
                that.profileServ.mergeCart(baseSiteid,_emptyObj,data.email,data.token,guidData['guid'],emptyCart['guid']).subscribe((resp)=>{
                   that.loading=false; 
                   that.showCrentialError=false;
                  //  that.router.navigate(['store','myaccount','profile','detail']);
              });
            
            },(error)=>{
              
              that.loading=false; 
            });
          }else{

      that.profileServ.getCurrentUserRelevantCart(baseSiteid,data.token,data.email).subscribe((resp)=>{
              if(resp['carts']){
                  const code =resp['carts'][0]['code'];
                  data['code']=code;
                  sessionStorage.setItem('customerToken',JSON.stringify(data));
           
              }
              const obj = { updateCart: true };
              that.singletonServ.sendMessage(obj);
              that.loading=false; 
              that.router.navigate(['store','myaccount','profile','detail']);
          },(error)=>{
          
              that.loading=false; 
          });
                
      }
  }


}
