import { Component, OnInit,OnDestroy, ViewChildren,ViewChild, QueryList,AfterViewInit, ViewEncapsulation,ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import {CategoryDetailComponentService} from './category-detail-page.service';
import {SingletonService} from '../services/singleton.service';
import { DeviceDetectorService } from 'ngx-device-detector';
declare var $BV;
@Component({
  selector: 'app-category-detail-page',
  templateUrl: './category-detail-page.component.html',
  styleUrls: ['./category-detail-page.component.scss'],  
  encapsulation: ViewEncapsulation.None
})
export class CategoryDetailPageComponent implements OnInit,AfterViewInit,OnDestroy {
  deviceInfo:any;
  mobileDevice:boolean;
  productInfo:any;
  navParamSubscription:any;
  breadcrumb:Array<any>;
  slides :Array<any>;
  workwell :Array<any>;
  slideConfig :any;
  workWellSlideConfig:any;
  cartTitle:'You might also like';
  childname:string;
  breadCrumbproductData:any;
  currentProd:any;
  code:string;
  constructor(private el: ElementRef,public location: Location,public router: Router,public route :ActivatedRoute,
    public singletonServ: SingletonService,public deviceService: DeviceDetectorService,private titleService: Title,public categoryServ:CategoryDetailComponentService) {
  
      const that =this;
      this. getDeviceInfo();
      const _catData=that.singletonServ.menudata;
      
      that.navParamSubscription = that.route.params.subscribe(params => {
        const code=params.itemid; 
        this.code=code;
        console.log('code',code);
        $BV.configure('global', { productId :  code});
      });

    }
  ngOnInit() {
  

  }

  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    if(isMobile || isTablet){
     this.mobileDevice=true;
    this.slides=[
      {img: "https://media.moltonbrown.co.uk/i/moltonbrown/KLT082_uk_Mesmerising-Oudh-Accord-Gold-Precious-Bathing-Oil_image_01?$mediumImg$&fmt=webp",name:'Mesmerising Oudh Accord & Gold Precious Bathing Oil',action:false},
      {img: "https://media.moltonbrown.co.uk/i/moltonbrown/KLT202_uk_Rosa-Absolute-Bathing-Oil-200ml_image_01?$mediumImg$&fmt=webp",name:'Rosa Absolute Sumptuous Bathing Oil',action:false}
    ];
    this.workwell= [
      {img: "https://media.moltonbrown.co.uk/i/moltonbrown/NHB081_uk_Mesmerising-Oudh-Accord-Gold-Bath-Shower-Gel-300ml_image_01?$mediumImg$&fmt=webp",name:'Mesmerising Oudh Accord & Gold Bath & Shower Gel',action:false},
      {img: "https://media.moltonbrown.co.uk/i/moltonbrown/NHH231_uk_Mesmerising-Oudh-Accord-Gold-Hand-Wash-300ml_image_01?$mediumImg$&fmt=webp",name:'Mesmerising Oudh Accord & Gold Fine Liquid Hand Wash',action:false}
    ];
    this.slideConfig= {"slidesToShow": 2, "slidesToScroll": 2,'title':'You might also like?'};
    this. workWellSlideConfig = {"slidesToShow": 2, "slidesToScroll": 2,'title':'Works well with'};
    }else{
      this.mobileDevice=false;
   this.slides=[
    {img: "https://media.moltonbrown.co.uk/i/moltonbrown/KLT082_uk_Mesmerising-Oudh-Accord-Gold-Precious-Bathing-Oil_image_01?$mediumImg$&fmt=webp",name:'Mesmerising Oudh Accord & Gold Precious Bathing Oil',action:false},
    {img: "https://media.moltonbrown.co.uk/i/moltonbrown/KLT202_uk_Rosa-Absolute-Bathing-Oil-200ml_image_01?$mediumImg$&fmt=webp",name:'Rosa Absolute Sumptuous Bathing Oil',action:false},
    {img: "https://media.moltonbrown.co.uk/i/moltonbrown/KLM082_uk_Mesmerising-Oudh-Accord-Gold-Precious-Body-Oil_image_01?$mediumImg$&fmt=webp",name:'Mesmerising Oudh Accord & Gold Precious Body Oil',action:false}
  ];
  this.workwell= [
    {img: "https://media.moltonbrown.co.uk/i/moltonbrown/NHB081_uk_Mesmerising-Oudh-Accord-Gold-Bath-Shower-Gel-300ml_image_01?$mediumImg$&fmt=webp",name:'Mesmerising Oudh Accord & Gold Bath & Shower Gel',action:false},
    {img: "https://media.moltonbrown.co.uk/i/moltonbrown/NHH231_uk_Mesmerising-Oudh-Accord-Gold-Hand-Wash-300ml_image_01?$mediumImg$&fmt=webp",name:'Mesmerising Oudh Accord & Gold Fine Liquid Hand Wash',action:false},
    {img: "https://media.moltonbrown.co.uk/i/moltonbrown/NHH009_uk_Orange-Bergamot-Hand-Wash-300ml_image_01?$mediumImg$&fmt=webp",name:'Orange & Bergamot Fine Liquid Hand Wash',action:false , "star": 4}
  ];
  this.slideConfig = {"slidesToShow": 3, "slidesToScroll": 3,'title':'You might also like?'};
  this. workWellSlideConfig = {"slidesToShow": 3, "slidesToScroll": 3,'title':'Works well with'};
    }
  }
  ngAfterViewInit(){
    const that =this;
    this.singletonServ.getMessage().subscribe(message => {
      if (message.catgories) {
            that.navParamSubscription = that.route.params.subscribe(params => {        
              let _catId=Object.values(params);
              _catId.pop();
              that.childname=_catId[1].replace(/[\. ',:-]+/g, "");
                     const code=params.itemid;     
                    that.getCategoryData(code,message); 
           });
      } 
     });

    




  }
  findCat(array, id) {
    if (typeof array != 'undefined') {
        for (var i = 0; i < array.length; i++) {
              let name=array[i].name.replace(/[\. ',:-]+/g, "").toLowerCase();
              let itemName=name.replace(/[\&]+/g,"").toLowerCase();
            if (itemName == id) {
                return [array[i]]
            }
            var a = this.findCat(array[i].subcategories, id);
            if (a != null) {
                a.unshift(array[i]);
                return a;
            }
        }
    }
    return null;
  }

  getCategoryData(code,message){
    const cVrsnid = this.singletonServ.catalogVersionId;
    const _catData=this.singletonServ.menudata;
    this.categoryServ.getMbProdDetails(code,cVrsnid).subscribe((resp)=>{
      const _code=resp['code'];
      this.singletonServ.menudata=message.catgories;
      const splitPath=window.location.pathname.split('/');
      const _catId=splitPath[splitPath.length-1];
      this.breadcrumb=this.findCat(message.catgories,this.childname);
      this.currentProd={categoryDisplayName:resp['productDisplayName'],name:resp['name'],code:_code};
      this.breadcrumb.push(this.currentProd);
      this.breadcrumb.splice(1,1);
      this.getThumbnails(_code,resp);
    },(err)=>{


    })
  }
  getThumbnails(code,resp){
    this.productInfo=resp;
    this.categoryServ.getrelevantDynamicData(code).subscribe((itm)=>{
      resp['thumbnails'] = itm['items'];
      this.productInfo=resp;
     },(err)=>{
  
     });
  }

  ngOnDestroy(){
    this.currentProd=undefined;
    this.breadcrumb=undefined;
  }
}
