import { Component, OnInit, AfterViewInit,ViewEncapsulation } from '@angular/core';
import {DeliveryComponentService} from './delivery.service';
import {HeaderComponentService} from '../../component/header/header.service';
import {SingletonService} from '../../services/singleton.service';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';
import {profileComponentService} from '../../component/profile-form/profile.service';
import { Event as NavigationEvent } from "@angular/router";
import { filter } from "rxjs/operators";
import { NavigationStart } from "@angular/router";





@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],  
  encapsulation: ViewEncapsulation.None
})
export class DeliveryComponent implements OnInit,AfterViewInit {
  savedCard:any;
  selected:string;
  deliveryService:boolean;
  deliveryDetails:Array<any>;
  paymentBlock:boolean;
  cartData:any;
  deliveryInfo:any;
  editForm:boolean;
  addressList:any;
  addressData:any;
  expressWay:boolean;
  reguser:boolean;
  deliveryCost:string;
  showLoading:boolean;
  expressService:boolean;
  collecionInfo:any;
  constructor(public deliveryServ:DeliveryComponentService,public singletonServ:SingletonService,
    public headerServ:HeaderComponentService,public profileServ:profileComponentService,
    public titleService:Title,public location: Location,public router: Router,public route :ActivatedRoute) { 
    this.deliveryService=false;
    this.paymentBlock=false;
    this.deliveryCost='TBC';
    this.showLoading=false;
    this.expressService=true;

const that =this;

//  router.events
//             .pipe(
//                 // The "events" stream contains all the navigation events. For this demo,
//                 // though, we only care about the NavigationStart event as it contains
//                 // information about what initiated the navigation sequence.
//                 filter(
//                     ( event: NavigationEvent ) => {
 
//                         return( event instanceof NavigationStart );
 
//                     }
//                 )
//             )
//             .subscribe(
//                 ( event: NavigationStart ) => {
//                     if(event.url == '/checkout/login'){
//                       if(sessionStorage.getItem('customerToken')){
//                       that.router.navigate(['store','mbcart','mbSamples']);
//                     }
//                   }
//                     if ( event.restoredState ) {
//                         console.warn(
//                             "restoring navigation id:",
//                             event.restoredState.navigationId
//                         );
 
//                     } 
//                 }
//             )
 




  }

  ngOnInit() {
    this.getFullCart();

 
  }
  getFullCart(){
    const cVrsnid = this.singletonServ.catalogVersionId;
    if(sessionStorage.getItem('customerToken')){
      this.reguser=true;
      const data = JSON.parse(sessionStorage.getItem('customerToken'));
    this.getCartDetail(cVrsnid,data);
  }else{
    if(sessionStorage.getItem('cartGUID')){
      this.reguser=false;
      const data = JSON.parse(sessionStorage.getItem('cartGUID'));
      this.annonymousCart(cVrsnid,data);
    }
  }
  }
  ngAfterViewInit(){
    const that=this;
      const queryStatus = this.route.snapshot.queryParamMap.get("expressCheckout"); 
      if(queryStatus){

        if(sessionStorage.getItem('customerToken')){
          const data = JSON.parse(sessionStorage.getItem('customerToken'));
          const emailid=data.email;
          const token=data['token'];
          this.getUserAddressList(emailid,token);
          this.savedCard={ 
            save:true,
            card:{
            cardType:'Visa',
            cardNumber:'4111111111111111',
            firstName:'Molton',
            lastName:'Brown', 
            month:'02', 
            year:'2025',
            cvv:'',
            communication:'',
            terms:''
          }}
        }
      }
      this.singletonServ.getMessage().subscribe(message => {
        if(message.updatFullCart){
           this.getFullCart();
        }
        // else if(message.selectedStore){
        //     that.deliveryService=true;
        //     that.expressService=false;
        //     that.collecionInfo=message.selectedStore;
        // }
      });  
  }
  getUserAddressList(email,token){
    const cVrsnid = this.singletonServ.catalogVersionId;
    const that=this;
    this.profileServ.getUserAddress(cVrsnid,token,email).subscribe((resp)=>{
      this.addressList=resp['addresses'];
      this.addressList.map((obj)=>{
        if(obj.defaultAddress){
          this.addressData=obj;
          this.deliveryService=true;
          const data={
            customerAddress:obj,
            deliveryType:'UK & International delivery'
          };
          this.deliveryInfo=data;
          that.expressWay=true;
          that.paymentBlock=true
          this.selected='credit';

        }
      });
    },(error)=>{

    });
  }
  
  getCartDetail(cVrsnid,data){
    const token =data.token;
    const email =data.email;
    const code=data.code;
    this.headerServ.getCurrentUserCartDetail(cVrsnid,token,email, code).subscribe((resp)=>{
     this.cartData=resp;
    },(error)=>{

    });
  }
  annonymousCart(cVrsnid,data){
    const that=this;
    const cartId = '/' + data['guid'];
    this.deliveryServ. getMBCartDetail(cVrsnid, cartId).subscribe((resp)=>{
      that.cartData=resp;
    },(err)=>{

    });
  }
  onDeleveryType(data){
    this.selected=data;
  }
  onShowDeliveryBlock(data){ 
    const that =this;
    const cVrsnid=this.singletonServ.catalogVersionId;
    if(sessionStorage.getItem('customerToken')){
      const user =JSON.parse(sessionStorage.getItem('customerToken'));
      data['defaultAddress']=true;
      data['titleCode']='mr';
      that.deliveryServ.generateCartToken().subscribe((token)=>{
           const tokenId=token['access_token'];
           that.deliveryServ.confirmAddress(cVrsnid,tokenId,user.email,user.code,data.id).subscribe((resp)=>{
            const obj={
              customerAddress:data,
              deliveryType:'UK & International delivery'
            };
            that.deliveryInfo=obj;
            that.deliveryService=true;
            that.expressService=true;
           },(error)=>{
            const obj={
              customerAddress:data,
              deliveryType:'UK & International delivery'
            };
            that.deliveryInfo=obj;
            that.deliveryService=true;
            that.expressService=true;
           });
      },(error)=>{

      });
      // this.deliveryServ.createUserAddress(cVrsnid,data,user.token,user.email).subscribe((resp)=>{
      //   this.deliveryInfo=obj;
      //   this.deliveryService=true;
      //    that.deliveryServ.setDeliveryMode(cVrsnid,user.token,user.email,user.code).subscribe((resp)=>{
      // console.log(resp);
      //    },(err)=>{

      //    });
      // },(err)=>{
        
      // });
      
  }else{
    const obj={
      customerAddress:data,
      deliveryType:'UK & International delivery'
    };
    that.deliveryInfo=obj;
    that.deliveryService=true;
    that.expressService=true;
  }
}
onShowLoading(data){
console.log(data)
  this.showLoading=data.show;

}
onCollectionChange(data){
   const that=this;
   this.paymentBlock=true;
}
onSelectedStore(data){
          this.paymentBlock=true;
          this.deliveryService=true;
          this.expressService=false;
          this.collecionInfo=data.selectedStore;
          this.paymentBlock=false;
}
  onSecureChanged(data){
    const that=this;
    if(data.payment){
      that.paymentBlock=data.payment;
   }else if(data.international){
      that.paymentBlock=true;
      that.getFullCart();
   }else{
      that.paymentBlock=data.payment;
     if(data.service){       
      that.deliveryService=true;
      that.expressService=true;
     }else{
      that.deliveryService=false;  
      if(sessionStorage.getItem('cartGUID')){
        that.editForm=data.formUpdate; 
      }
        if(data.type=='delivery'){
           this.selected=undefined;
        }       
     }  
   }

  }

  onEditBasket(){
   this.router.navigate(['store','mbcart']);
  }

  delivryServiceMethod(data){

    console.log(data);

  }
  onupdateCart(data){

     this.getFullCart();
  }
}
