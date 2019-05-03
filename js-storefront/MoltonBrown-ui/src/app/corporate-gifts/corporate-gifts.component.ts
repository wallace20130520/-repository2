import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from 'lodash';
declare var $: any;
declare var AmpCa :any
@Component({
  selector: 'app-corporate-gifts',
  templateUrl: './corporate-gifts.component.html',
  styleUrls: ['./corporate-gifts.component.scss']
})
export class CorporateGiftsComponent implements OnInit {

  @ViewChild('corporateGift') corporateGift:ElementRef;
  constructor() { }

  ngOnInit() {
    this.renderTemplate();
  }
  renderTemplate(){
    const that =this;
    AmpCa.utils = new AmpCa.Utils();
    AmpCa.utils.getHtmlServiceData({
        auth: {
            baseUrl: 'https://c1.adis.ws',
            id:'d49b6963-7982-421b-9fc4-59a8bfb4d445',
            store: 'moltonbrown',
            templateName: 'acc-template-text',
            locale:'en-GB'
        },
        callback: function (htm) {
            that.corporateGift.nativeElement.innerHTML=htm;                              
        
        }
    });
  }

}
