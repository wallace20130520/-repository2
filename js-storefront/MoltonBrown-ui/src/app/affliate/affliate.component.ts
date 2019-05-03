import { Component, OnInit,ElementRef,ViewChild,ViewEncapsulation } from '@angular/core';
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
  selector: 'app-affliate',
  templateUrl: './affliate.component.html',
  styleUrls: ['./affliate.component.scss'],    
  encapsulation: ViewEncapsulation.None
})
export class AffliateComponent implements OnInit {
  @ViewChild('affliateEl') affliateEl:ElementRef;
  constructor(public location: Location,public deviceService: DeviceDetectorService,public router: Router,public route :ActivatedRoute,private titleService: Title) {
    

    }

  ngOnInit() {
const data={
  templateId:'457774a2-f216-4db5-8297-c16679bd739e',
  templateName:'acc-template-homepage',
  contentType:'homepage'
}
    this.renderTemplate(data)
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
            that.affliateEl.nativeElement.innerHTML=htm;
            if(content.contentType != 'text')
            AmpCa.utils.postProcessing.execHtmlService(content.contentType, {});                               
        
        }
    });
  }
}
