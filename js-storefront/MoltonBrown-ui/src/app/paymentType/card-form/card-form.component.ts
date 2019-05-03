import { Component, OnInit,Input,OnChanges,SimpleChange } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import {PaymentGateWayForm} from '../../forms/paymentCard.form';
import {cardFormComponentService} from './card-form.service';
import {SingletonService} from '../../services/singleton.service';
import { DeviceDetectorService } from 'ngx-device-detector';
@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss']
})
export class CardFormComponent implements OnInit,OnChanges {
  @Input() deliveryInfo: any;
  @Input() showSubmitBtn: any;
  @Input() updateSavedCard:any;
  billingAddress:boolean;
  cardDetailForm:FormGroup;
  expireMonth:Array<any>;
  expireYear:Array<any>;
  shippingAddress:any;
  loading:boolean;
  deviceInfo:any;
  currentUser:boolean;
  constructor(public location: Location,public router: Router,public singletonServ:SingletonService,
    public route :ActivatedRoute,private fb: FormBuilder,public _checkOutForm:PaymentGateWayForm,
    public cyberService:cardFormComponentService,public deviceService: DeviceDetectorService) {
      this.billingAddress=true;
    this.cardDetailForm=this.fb.group(_checkOutForm.getCardForm());   
                                        
    this.loading=false;
    const monthNumber:number=1;
    const monthBox=[];
    const yearBox=[];
    for(let i=1;i<=12;i++){
      let count='';
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
    this. getDeviceInfo();
    if(sessionStorage.getItem('customerToken')){
      this.currentUser=true;
    }
  }
  onChangeCountry(event){

  }
  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange })  {    
    if (changes['deliveryInfo']){
      if (changes['deliveryInfo']['currentValue'] != undefined){
       this.shippingAddress=changes['deliveryInfo']['currentValue'];
       console.log(this.shippingAddress)
      }
      if(changes['updateSavedCard']['currentValue'] != undefined){
              let data=changes['updateSavedCard']['currentValue']; 
              if(data['save']){
                this.cardDetailForm.patchValue(data.card);
              }
      }
    }
  }
  oncheckoutContinue(event){
    event.stopPropagation();
    const that =this;
    const cardForm =this.cardDetailForm.value;
    const shipAddress =this.shippingAddress.customerAddress;
    const obj={
      "accountHolderName":cardForm.firstName +''+cardForm.lastName,
      "cardNumber":cardForm.cardNumber,
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
          }
      }
   };
   const cVrsnid=this.singletonServ.catalogVersionId;
   if(sessionStorage.getItem('customerToken')){
    that.currentUser=true;
     const data =JSON.parse(sessionStorage.getItem('customerToken'));
     const token=data['token'];
     const code=data['code'];
     const _email=data['email'];
     this.loading=true;
     const body={}; 
     that.confirmOrder(cVrsnid,token,obj,_email,code,cardForm.cvv);
    }else{
      if(sessionStorage.getItem('cartGUID')){
        const data =JSON.parse(sessionStorage.getItem('cartGUID'));
        const code=data['code'];
        const cartGUID=data['guid'];
        const _email=data['email'];
        that.cyberService.generateCartToken().subscribe((token)=>{
             const tokenId = token['access_token']; 
             that.guestOrder(cVrsnid,tokenId,obj,cartGUID,cardForm.cvv);         
        },(err)=>{
          this.loading=false;
        });
      }
    }
  }
  guestOrder(cVrsnid,tokenId,obj,cartGUID,cvv){
    const that=this;
    that.cyberService.guestPayment(cVrsnid,tokenId,obj,cartGUID).subscribe((resp)=>{
      that.singletonServ.confirmOrderObj=resp;
      resp['securityCheck']=cvv;
      localStorage.setItem('order',JSON.stringify(resp));
      that.loading=false;
      that.router.navigate(['/checkout','confirmation']);
    },(err)=>{
      that.loading=false;
    });
  }
  confirmOrder(cVrsnid,token,body,_email,code,cvv){
    const that=this;
    that.cyberService.confirmOrder(cVrsnid,token,body,_email,code,cvv).subscribe((resp)=>{
      that.singletonServ.confirmOrderObj=resp;
      localStorage.setItem('order',JSON.stringify(resp));
      that.loading=false;
      that.router.navigate(['/checkout','confirmation']);
    },(err)=>{
      that.loading=false;
    });
  }
  onChangeCardType(event){
    const cardType =event.target.value;
    this.cardDetailForm.controls['cardNumber'].setValidators([Validators.required,Validators.minLength(16),Validators.maxLength(16)]);
    this.cardDetailForm.controls['cvv'].setValidators([Validators.required,Validators.minLength(3),Validators.maxLength(3)]);
    this.cardDetailForm.controls['cardNumber'].updateValueAndValidity();
    this.cardDetailForm.controls['cvv'].updateValueAndValidity();
  }
  onChangeBillingAddress(){

  }
}
