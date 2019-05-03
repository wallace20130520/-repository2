import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
@Component({
  selector: 'app-checkoutpage',
  templateUrl: './checkoutpage.component.html',
  styleUrls: ['./checkoutpage.component.scss']
})
export class CheckoutpageComponent implements OnInit {
  deviceInfo:any;
  mobileDevice:boolean;
  cuurent:boolean;
  basket:boolean;
  sample:boolean;
  confirmation:boolean;
  constructor(private deviceService: DeviceDetectorService) { }
  ngOnInit() {
    const splitPath=window.location.pathname.split('/');
    let page= splitPath[splitPath.length-1];
    if(page=="basket"){
      this.cuurent=true;
      this.basket=true;
      this.sample=false;
      this.confirmation=false;
    }else if(page=="mbSamples"){
      this.cuurent=true;
      this.basket=false;
      this.sample=true;
      this.confirmation=false;
    }else{
      this.cuurent=true;
      this.basket=false;
      this.sample=false;
      this.confirmation=true;
    }
    this.getDeviceInfo();
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

}
