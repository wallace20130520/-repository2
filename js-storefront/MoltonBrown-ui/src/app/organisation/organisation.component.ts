import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import {organisation} from '../staticpage.constant';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from 'lodash';
declare var $: any;
declare var AmpCa :any
@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss']
})
export class OrganisationComponent implements OnInit {
  @ViewChild('orgnaisationEl') orgnaisationEl:ElementRef;
  orgMenu:boolean;
   searchByData=organisation;
   deviceInfo:any;
   mobileDevice:boolean;
  constructor(public location: Location,public deviceService: DeviceDetectorService,public router: Router,public route :ActivatedRoute,private titleService: Title) {
    this.orgMenu=true;

   }

  ngOnInit() {
    const that =this;
    let _catData = that.searchByData
    this.route.params.subscribe(params => {
    //  const obj = _.find(this.searchByData, function(o) { return o.filterBy == params.sitename; });
    for (let obj of _catData) {
      const  result = that.dfs(obj, params.sitename);
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
  dfs(obj, targetId) {
    if (obj['filterBy'] === targetId) {
        return obj
    }
    if (obj.children) {
        for (let item of obj.children) {
            let check = this.dfs(item, targetId)
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
            that.orgnaisationEl.nativeElement.innerHTML=htm;
            if(content.contentType != 'text')
            AmpCa.utils.postProcessing.execHtmlService(content.contentType, {});                               
        
        }
    });
  }
  onMenuContentClick(data,k){
    
    if(!this.mobileDevice){
      this.router.navigate(['store',data.filterBy]);
    }else{
     if(data.children){
        this.searchByData[k]['show']=! this.searchByData[k]['show'];
     }
    }
  }
  onSubMenuContentClick(event,data){
    event.stopPropagation();
    this.router.navigate(['store',data.filterBy]);
  }
  onCollapseMenu(){
    if(this.orgMenu){
      this.orgMenu=false;
    }else{
      this.orgMenu=true;
    }
  }
}
