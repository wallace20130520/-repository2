import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from 'lodash';
declare var $: any;
declare var AmpCa :any
@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {
  @ViewChild('salesEl') salesEl:ElementRef;
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
            id:'0c9ca4b0-abfe-4803-864c-7fa3189e178b',
            store: 'moltonbrown',
            templateName: 'acc-template-specialofferbanner',
            locale:'en-GB'
        },
        callback: function (htm) {
            that.salesEl.nativeElement.innerHTML=htm;                              
            AmpCa.utils.postProcessing.execHtmlService('specialofferbanner', {});  
        }
    });
  }


}
