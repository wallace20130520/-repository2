import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import {giftCard} from '../staticpage.constant';
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
  selector: 'app-gift-cards',
  templateUrl: './gift-cards.component.html',
  styleUrls: ['./gift-cards.component.scss']
})
export class GiftCardsComponent implements OnInit {
  @ViewChild('giftCardEl') giftCardEl:ElementRef;
  orgMenu:boolean;
  searchByData=giftCard;
  deviceInfo:any;
  mobileDevice:boolean;
 
 constructor(public location: Location,public deviceService: DeviceDetectorService,public router: Router,public route :ActivatedRoute,private titleService: Title) {
   this.orgMenu=true;

  }
  ngOnInit() {
  
  }
  renderTemplate(){
 
  }
  onMenuContentClick(data,k){
   this.router.navigate([data.route]);
  }
}
