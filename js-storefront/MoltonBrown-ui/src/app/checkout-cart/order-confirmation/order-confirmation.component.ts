import { Component, OnInit ,ViewEncapsulation} from '@angular/core';
import {SingletonService} from '../../services/singleton.service';
import { Router,ActivatedRoute ,NavigationEnd} from '@angular/router';
import {ConfirmationComponentService} from './order-confirmation.service';
import { Session } from 'protractor';
import { Event as NavigationEvent } from "@angular/router";
import { filter } from "rxjs/operators";
import { NavigationStart } from "@angular/router";
@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderConfirmationComponent implements OnInit {
  guestUser:boolean;
  orderDetails:Array<any>;
  order:any;
  guest:any;
  constructor(public singletonServ:SingletonService,public router: Router,
          public orderServ:ConfirmationComponentService,public route :ActivatedRoute) {

            const that=this;
            
 router.events
 .pipe(
     // The "events" stream contains all the navigation events. For this demo,
     // though, we only care about the NavigationStart event as it contains
     // information about what initiated the navigation sequence.
     filter(
         ( event: NavigationEvent ) => {

             return( event instanceof NavigationStart );

         }
     )
 )
 .subscribe(
     ( event: NavigationStart ) => {
         if(event.url == '/checkout/shipping'){
           if(sessionStorage.getItem('customerToken')){

              sessionStorage.removeItem('customerToken');
    sessionStorage.removeItem('cartGUID');
    sessionStorage.clear();
    sessionStorage.removeItem('cartGUID');
    localStorage.removeItem('order');
    localStorage.clear();
    this.router.navigate(['store']);
         }
       }
         if ( event.restoredState ) {
             console.warn(
                 "restoring navigation id:",
                 event.restoredState.navigationId
             );

         } 
     }
 )




    
   }

  ngOnInit() {
    const that=this;
    const _guestcookie= this.singletonServ.getCookie('cartGUID');
    const _usercookie= this.singletonServ.getCookie('user');
    const cVrsnid=this.singletonServ.catalogVersionId;
    this.orderServ.generateCartToken().subscribe((token)=>{
       const tokenId = token['access_token'];
if(localStorage.getItem('order')){
  const _order=JSON.parse(localStorage.getItem('order'))
      if(sessionStorage.getItem('customerToken') || _usercookie){
        const user =JSON.parse(sessionStorage.getItem('customerToken'));
          that.guestUser=false;
          that.getOrderDetail(cVrsnid,tokenId,_order.code,user.email);
        }else{
        if(sessionStorage.getItem('cartGUID') || _guestcookie){
          const cart =JSON.parse(sessionStorage.getItem('cartGUID'));
          this.guest=cart;
          that.guestUser=true;
          that.getGuestOrderDetail(cVrsnid,tokenId,_order,cart);
        }
      }
    }
    },(error)=>{

    });
  }
  getGuestOrderDetail(cVrsnid,tokenId,order,cart){

  this.orderServ.getOrderData(cVrsnid,tokenId,order['code']).subscribe((resp)=>{
    this.order=resp;
  })

  }
  getOrderDetail(cVrsnid,tokenId,order,emailId){
      this.orderServ.orderService(cVrsnid,tokenId,order,emailId).subscribe((resp)=>{
           this.order=resp;
      },(error)=>{
        
      });
  }
  onNavigateHome(){
    sessionStorage.removeItem('customerToken');
    sessionStorage.removeItem('cartGUID');
    sessionStorage.clear();
    sessionStorage.removeItem('cartGUID');
    localStorage.removeItem('order');
    localStorage.clear();
    this.router.navigate(['store']);
  }
}
