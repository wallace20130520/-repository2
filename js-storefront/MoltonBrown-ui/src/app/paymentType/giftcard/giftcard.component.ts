import { Component, OnInit ,ViewEncapsulation,Input,OnChanges, SimpleChange} from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import {PaymentGateWayForm} from '../../forms/paymentCard.form';
import {cardFormComponentService} from '../card-form/card-form.service';
import {SingletonService} from '../../services/singleton.service';
import {GiftCardService} from './giftcard.service';
@Component({
  selector: 'app-giftcard',
  templateUrl: './giftcard.component.html',
  styleUrls: ['./giftcard.component.scss']
})
export class GiftcardComponent implements OnInit,OnChanges {
  @Input() cartData:any;
  @Input() deliveryInfo:any;
  cardDetailForm:FormGroup;
  expireMonth:Array<any>;
  expireYear:Array<any>;
  paymentGiftSouce:string;
  showCard:boolean;
  shippingAddress:any;
  loading:boolean;
  constructor(public location: Location,public router: Router,public singletonServ:SingletonService,public giftServ:GiftCardService,
    public route :ActivatedRoute,private fb: FormBuilder,private splitFB: FormBuilder,public _checkOutForm:PaymentGateWayForm,public cyberService:cardFormComponentService) {
      const monthBox=[];
      const yearBox=[];
      for(let i=1;i<=12;i++){
        if(i>=10){
          const obj ={month:''+i}
          monthBox.push(obj);
        }else{
          const obj ={month:'0'+i}
          monthBox.push(obj); 
        }
  
      }
      this.expireMonth=monthBox;
      const date=new Date();
      for(let k=1;k<=24;k++){
          const obj ={year:date.getFullYear()+k}
          yearBox.push(obj); 
      }
      this.expireYear=yearBox;
   }

  ngOnInit() {
    this.paymentGiftSouce='';
  }
  onChangePaymenttype(bol){
      if(bol){
        this.paymentGiftSouce='gift';
        this.cardDetailForm=this.fb.group(this._checkOutForm.getGiftForm());  
        this.showCard=false;
      }else{
        this.paymentGiftSouce='gift';
        this.cardDetailForm=this.splitFB.group(this._checkOutForm.getSpliForm()); 
        this.cardDetailForm.updateValueAndValidity();
        this.showCard=true;
      }
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange })  {
    
    
    if (changes['deliveryInfo']){
      if (changes['deliveryInfo']['currentValue'] != undefined){
       this.shippingAddress=changes['deliveryInfo']['currentValue'];
      }
    }
  }
  onGiftDetailSubmit(event){
     const that=this;
     event.preventDefault();
     this.loading=true;
     const cardForm=this.cardDetailForm.value;
     const shipAddress =this.shippingAddress.customerAddress;    
     const obj={
       "accountHolderName":cardForm.firstName +''+cardForm.lastName,
       "cardNumber":"4111111111111111",
       "cardType":{
         "code":cardForm.cardType
     },
       "expiryMonth":cardForm.month,
       "expiryYear":cardForm.year,
       "defaultPayment":true,
       "billingAddress":{
           "titleCode":"mr",
           "firstName":shipAddress.firstName,
           "lastName":shipAddress.lastName,
           "line1":shipAddress.line1,
           "line2":shipAddress.line2,
           "postalCode":"76107",
           "town":"Osaka",
           "country":{
               "isocode":"GB",
               "name":"UK"
           },
           "region":{
               "isocode":"GB-ENG"
           }
       }
    };
const giftCard={
   "accountHolderName":"Aditya",
   "cardNumber":cardForm.GivexCardNumber,
    "cardType":{
     "code":"mbGiftCard"
    },
   "expiryMonth":"09",
   "expiryYear":"2017",
   "defaultPayment":false,
   "billingAddress":{
    "titleCode":"mr",
    "firstName":"John",
    "lastName":"Doe",
    "line1":"Toyosaki",
    "line2":"3-16-19",
    "postalCode":"76107",
    "town":"Osaka",
    "country":{
      "isocode":"GB",
      "name":"UK"
  }
}
}
    const cVrsnid=this.singletonServ.catalogVersionId;
     
    this.giftServ.generateCartToken().subscribe((token)=>{
      const _token=token['access_token'];
    if(sessionStorage.getItem('customerToken')){
      const user =JSON.parse(sessionStorage.getItem('customerToken'));
      const code=user.code;
      const email=user.email;
     
    if(!this.showCard){

      that.giftServ.addPaymentDetails(cVrsnid,giftCard,_token,code,email).subscribe((payment)=>{
        const _body={
          "FirstName":cardForm.FirstName,
          "LastName":cardForm.LastName,
          "giftcardnumber":cardForm.GivexCardNumber,
          "giftcardpin":cardForm.GivexPinNumber,
          "giftcardamount":cardForm.Amount
          }
             that.giftServ.giftCardService(cVrsnid,_body,_token,user.email,user.code).subscribe((resp)=>{          
                  if(resp) {
                    this.loading=false;
                      localStorage.setItem('order',JSON.stringify(resp));     
                      this.router.navigate(['/checkout','confirmation']);
                    }
                 });
      },(err)=>{
        this.loading=false;
      });

  }else{   
      that.splitPaymentMethod(cVrsnid,obj,_token,user.code,email,cardForm);
     }

  }else{
    if(sessionStorage.getItem('cartGUID')){
      const user =JSON.parse(sessionStorage.getItem('cartGUID'));
      if(!this.showCard){
      that.giftServ.addGuestPaymentDetails(cVrsnid,giftCard,_token,user.guid,user.email).subscribe((payment)=>{
        const _body={
          "FirstName":cardForm.FirstName,
          "LastName":cardForm.LastName,
          "giftcardnumber":cardForm.GivexCardNumber,
          "giftcardpin":cardForm.GivexPinNumber,
          "giftcardamount":cardForm.Amount
          }
             that.giftServ.guestGiftCardService(cVrsnid,_body,_token,user.guid).subscribe((resp)=>{          
                  if(resp) {
                      localStorage.setItem('order',JSON.stringify(resp));  
                      this.loading=false;   
                      this.router.navigate(['/checkout','confirmation']);
                    }
                 });
      },(err)=>{

      });
    }else{
      that.guestSplitPaymentMethod(cVrsnid,obj,_token,user.guid,cardForm);
    }
    }
  }
},(error)=>{
  this.loading=false;      
});
  }
  guestSplitPaymentMethod(cVrsnid,obj,token,guid,cardForm){
    this.giftServ.guestSplitPayment(cVrsnid,obj,token,guid,cardForm).subscribe((response)=>{
      this.loading=false;
      localStorage.setItem('order',JSON.stringify(response));  
      this.router.navigate(['/checkout','confirmation']);
    },(err)=>{
      this.loading=false;
    })

  }
  splitPaymentMethod(cVrsnid,obj,_token,_code,email,cardForm){

    this.giftServ.splitPayment(cVrsnid,obj,_token,_code,email,cardForm).subscribe((response)=>{
          this.loading=false;
          localStorage.setItem('order',JSON.stringify(response));  
          this.router.navigate(['/checkout','confirmation']);
        },(error)=>{
          this.loading=false;
        });
  }
}
