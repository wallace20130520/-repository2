import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from 'lodash';
declare var $: any;
declare var AmpCa :any
@Component({
  selector: 'app-special-offers',
  templateUrl: './special-offers.component.html',
  styleUrls: ['./special-offers.component.scss']
})
export class SpecialOffersComponent implements OnInit {
  @ViewChild('specialOffer') specialOffer:ElementRef;
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
            id:'5e146e95-cd82-4db6-95a3-70c228cf268a',
            store: 'moltonbrown',
            templateName: 'acc-template-homepage',
            locale:'en-GB'
        },
        callback: function (htm) {
            that.specialOffer.nativeElement.innerHTML=htm;                              
            AmpCa.utils.postProcessing.execHtmlService('homepage', {});  
        }
    });
  }


}
