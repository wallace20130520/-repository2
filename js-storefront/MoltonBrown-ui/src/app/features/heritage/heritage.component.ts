import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from 'lodash';
declare var $: any;
declare var AmpCa :any
@Component({
  selector: 'app-heritage',
  templateUrl: './heritage.component.html',
  styleUrls: ['./heritage.component.scss']
})
export class HeritageComponent implements OnInit {

  @ViewChild('heritageEl') heritageEl:ElementRef;
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
            id:'1836243f-e358-41c5-b2b7-fc43e3f0d1f4',
            store: 'moltonbrown',
            templateName: 'acc-template-homepage',
            locale:'en-GB'
        },
        callback: function (htm) {
            that.heritageEl.nativeElement.innerHTML=htm;                              
            AmpCa.utils.postProcessing.execHtmlService('homepage', {});   
        }
    });
  }



}
