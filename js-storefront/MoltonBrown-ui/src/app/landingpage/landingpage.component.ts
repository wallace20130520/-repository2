import { Component, OnInit,AfterViewInit,ViewEncapsulation } from '@angular/core';

import { Location } from '@angular/common';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';
import * as amp from '../../assets/js/amp-min.js';
import * as Handlebars from '../../assets/js/handlebar.min';
import '../../assets/js/handlebars_helpers';
import { AMPLIENCETEMPLATE} from '../handlebar.constant';
import {SingletonService} from '../services/singleton.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
declare var $: any;
declare var AmpCa :any
@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],  
  encapsulation: ViewEncapsulation.None
})
export class LandingpageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
   this.getcardFromRenderingServ(); 
  }
  getcardFromRenderingServ(){
    AmpCa.utils = new AmpCa.Utils();
    AmpCa.utils.getHtmlServiceData({
        auth: {
            baseUrl: 'https://c1.adis.ws',
            id: '3188a40c-c79b-47c9-9863-6e1d79616c03',
            store: 'moltonbrown',
            templateName: 'acc-template-homepage',
            locale:'en-GB'
        },
        callback: function (data) {
            document.querySelectorAll(".landing_template_wrappper")[0].innerHTML = data;
            AmpCa.utils.postProcessing.execHtmlService('splitBlock');           
                                 let _script = document.createElement("script");
                                 _script.type = "text/javascript";
                                 _script.src = "//d81mfvml8p5ml.cloudfront.net/yre05t09.js";
                                 document.head.appendChild(_script);             
        
        }
    });
  }
}
