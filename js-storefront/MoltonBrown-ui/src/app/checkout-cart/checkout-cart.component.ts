import { Component, OnInit ,ElementRef,ViewChild,ViewEncapsulation} from '@angular/core';
import {SingletonService} from '../services/singleton.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Location } from '@angular/common';
import { Router,ActivatedRoute ,NavigationEnd} from '@angular/router';
import * as _ from 'lodash';
declare var $: any;
declare var AmpCa :any
@Component({
  selector: 'app-checkout-cart',
  templateUrl: './checkout-cart.component.html',
  styleUrls: ['./checkout-cart.component.scss'],    
  encapsulation: ViewEncapsulation.None
})
export class CheckoutCartComponent implements OnInit {
  @ViewChild('policyEl') policyEl:ElementRef;
  deviceInfo:any;
  mobileDevice:boolean;
  cuurent:boolean;
  login:boolean;
  delivery:boolean;
  confirmation:boolean;
  modalTitle:string;
  footerLinks=[
    {name:'Delivery Information',templateName:'acc-template-text',contentId:'7039313a-8175-4335-ab26-1aca964c240a',contentType:''},
    {name:'Returns Policy',templateName:'acc-template-text',contentId:'39b7a4e9-3aa4-4728-80a2-845394181342',contentType:''},
    {name:'Privacy &amp; Cookie Policy',templateName:'acc-template-text',contentId:'39b7a4e9-3aa4-4728-80a2-845394181342',contentType:''},
    {name:'Terms &amp; Conditions',templateName:'acc-template-text',contentId:'a0e6f518-9205-41ff-82fa-c3544aaccb62',contentType:''}
  ];
  constructor(public deviceService: DeviceDetectorService,public singletonServ :SingletonService, public location: Location, public router: Router,public route :ActivatedRoute) { 
    this.singletonServ.checkoutStatus=true;
    const obj={checkoutStatus:true};
    this.singletonServ.sendMessage(obj);
  }

  ngOnInit() {

    const splitPath=window.location.pathname.split('/');
    let page= splitPath[splitPath.length-1];
    if(page=="login"){
      this.cuurent=true;
      this.login=true;
      this.delivery=false;
      this.confirmation=false;
    }else if(page=="shipping"){
      this.cuurent=true;
      this.login=false;
      this.delivery=true;
      this.confirmation=false;
    }else if(page=="confirmation"){
      this.cuurent=true;
      this.login=false;
      this.delivery=false;
      this.confirmation=true;
    }
    this.getFooterInfo();
    this.getDeviceInfo();
  }
  getFooterInfo(){
    const that =this;
    this.footerLinks.map((obj,k)=>{

    AmpCa.utils = new AmpCa.Utils();
    AmpCa.utils.getHtmlServiceData({
        auth: {
            baseUrl: 'https://c1.adis.ws',
            id:obj.contentId,
            store: 'moltonbrown',
            templateName: obj.templateName
        },
        callback: function (htm) {                           
        obj['htm']=htm;
        }
    });
    
  });
  }
  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    if(isMobile || isTablet){
     this.mobileDevice=true;
    }else{
      this.mobileDevice=false;
    }
  }
  goToHome(){
   this.singletonServ.checkoutStatus=false;
   const obj={checkoutStatus:false};
   this.singletonServ.sendMessage(obj);
   
   this.router.navigate(['store']);
  }
  onOpenCartModal(data){
    this.modalTitle=data.name;
     this.policyEl.nativeElement.innerHTML=data.htm;
  }
}
