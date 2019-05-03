import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import {hotelAmenities} from '../staticpage.constant';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from 'lodash';
import * as amp from '../../assets/js/amp-min.js';
import * as Handlebars from '../../assets/js/handlebar.min';
declare var $: any;
declare var AmpCa :any
@Component({
  selector: 'app-hotel-amenities',
  templateUrl: './hotel-amenities.component.html',
  styleUrls: ['./hotel-amenities.component.scss']
})
export class HotelAmenitiesComponent implements OnInit {
  @ViewChild('hotelAmenitiesEl') hotelAmenitiesEl:ElementRef;
  orgMenu:boolean;
   searchByData=hotelAmenities;
   deviceInfo:any;
   mobileDevice:boolean;
  constructor(public location: Location,public deviceService: DeviceDetectorService,public router: Router,public route :ActivatedRoute,private titleService: Title) {
    this.orgMenu=true;

   }

  ngOnInit() {
    const that =this;
   let _catData = that.searchByData
    this.route.params.subscribe(params => {
      const sitename =(params.sitename)?params.sitename:window.location.pathname.substr(1).split('/')[1];
    //  const obj = _.find(this.searchByData, function(o) { return o.filterBy == params.sitename; });
    for (let obj of _catData) {
      const  result = that.getChildObj(obj,sitename);
        if (result) {
            this.renderTemplate(result);
            break;
        }
    }
    });
    this.getDeviceInfo();
  }
  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    if(isMobile || isTablet){
     this.mobileDevice=true;
     this.orgMenu=false;
    }else{
      this.mobileDevice=false;
      this.orgMenu=true;
    }
  }
  getChildObj(obj, targetId) {
    if (obj['filterBy'] === targetId) {
        return obj
    }
    if (obj.children) {
        for (let item of obj.children) {
            let check = this.getChildObj(item, targetId)
            if (check) {
                return check
            }
        }
    }
    return null
}
  renderTemplate(data){
    const that =this;
    const content =data;
    AmpCa.utils = new AmpCa.Utils();
    AmpCa.utils.getHtmlServiceData({
        auth: {
            baseUrl: 'https://c1.adis.ws',
            id: data.templateId,
            store: 'moltonbrown',
            templateName: data.templateName,
            locale:'en-GB'
        },
        callback: function (htm) {
            that.hotelAmenitiesEl.nativeElement.innerHTML=htm;
            if(content.contentType != 'text'){
             AmpCa.utils.postProcessing.execHtmlService(content.contentType, {});
             AmpCa.utils.postProcessing.execHtmlService('splitBlock', {});                               
           }
        }
    });
  }
  onMenuContentClick(data,k){
    if(!this.mobileDevice){
      if(data.filterBy =='hotel-amenities' ){
        this.router.navigate(['store','hotel-amenities']);
      }else{
        this.router.navigate(['store','hotel-amenities',data.filterBy]);
      }
    }else{
     if(data.children){
    
        this.searchByData[k]['show']=! this.searchByData[k]['show'];
     }
    }
  }
  onSubMenuContentClick(event,data,subData){
    event.stopPropagation();
    this.router.navigate(['store','hotel-amenities',data.filterBy,subData.filterBy]);
  }
  onCollapseMenu(){
    if(this.orgMenu){
      this.orgMenu=false;
    }else{
      this.orgMenu=true;
    }
  }
}
