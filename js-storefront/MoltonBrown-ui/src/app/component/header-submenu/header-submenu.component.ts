import { Component, OnInit,ViewEncapsulation,AfterViewInit,ElementRef,ViewChild,Renderer } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AMPLIENCETEMPLATE} from '../../handlebar.constant';
import {HeaderComponentService} from '../header/header.service';
import {SingletonService} from '../../services/singleton.service';
import {moltonBrownPolicies,CountryJsonData} from '../../staticpage.constant';
import { Location } from '@angular/common';
import { Router,ActivatedRoute ,NavigationEnd} from '@angular/router';
import * as _ from 'lodash';
declare var AmpCa :any

declare var $: any;
@Component({
  selector: 'app-header-submenu',
  templateUrl: './header-submenu.component.html',
  styleUrls: ['./header-submenu.component.scss'],  
  encapsulation: ViewEncapsulation.None
})




export class HeaderSubmenuComponent implements OnInit,AfterViewInit {
  @ViewChild('searchInput') searchField:ElementRef;
  searchPrdctText:any;
  sidemenuStatus:boolean;
  menuData:any;
  footerData:Array<any>=moltonBrownPolicies;
  toggle:boolean;
  searchCtgry:boolean;
  slotID = "0df2691b-1f42-4732-b581-0dba5cb191c0";
  imageContent: string = AMPLIENCETEMPLATE.CSDEMO.trim();
  contentDeliveryUrl: any;
  templates:Array<any>;
  mouseEnter:boolean;
  submenuData:Array<any>;
  catalog:Array<any>=CountryJsonData;
  cartCount:number;
  searchBlock:boolean;
  searchResults:Array<any>;
  searchResultValue:string;
  hoverOnSearchBlock:boolean;
  allProducts:any;
  constructor(public titleService:Title,public renderer:Renderer,public el: ElementRef,public headerServ:HeaderComponentService,public singletonServ:SingletonService,
    public location: Location, public router: Router,public route :ActivatedRoute) {
      this.searchResults=[];
      this.searchResultValue='';
      this.cartCount=0;
    this.sidemenuStatus=false;
    this.contentDeliveryUrl = "https://c1.adis.ws/cms/content/query?fullBodyObject=true&query="
      + encodeURIComponent(JSON.stringify({ "sys.iri": "http://content.cms.amplience.com/" + this.slotID }))
      + "&scope=tree&store=1digitals";
      this.searchBlock=false;
     

  }
  ngOnInit() {
    this.renderCatalogData();
  }
  ngAfterViewInit(){  

    this.singletonServ.getMessage().subscribe(message => {
      if(message.cartCount){
            let sum=0;
            for (let i = 0; i < message.response['entries'].length; i++) {
              sum += message.response['entries'][i]['quantity'];
          }
           this.cartCount=sum;
        }else     if (message.moltonSideumenu) {
          window.scroll(0, 0);
          this.sidemenuStatus= message.moltonSideumenu.state;
        }
       })
      
  }

  renderCatalogData(){
    const that=this;
    const catalogId =this.singletonServ.catalogVersionId;
    this.headerServ.getCatalogData(catalogId).subscribe((resp)=>{
    const catalogData = resp['catalogs'][0]['catalogVersions'];
    const menuId = _.findIndex(catalogData, function (o) { return o.id == "Online"; }); 
    this.menuData = catalogData[menuId].categories;
    this.menuData.sort(function(a, b){return  a.order-b.order });
    this.menuData.map((obj,k)=>{
      if(obj['subcategories']){
          this.menuData[k]['subcategories'].sort(function(a, b){return  a.order-b.order });
      }

         if(obj.bannerId){
          let bannerBox =obj.bannerId.split(',');
          _.forEach(bannerBox, function(value,i) {
            value.replace('/ /g','');
          obj['content']=new Array();
         AmpCa.utils.getHtmlServiceData({
          auth: {
              baseUrl: 'https://c1.adis.ws',
              id: value.trim(),
              store: 'moltonbrown',
              templateName: 'acc-template-card',
              locale:'en-GB'
          },
          callback: function (data) {
            const temp={
              templatename:data
            }
            obj['content'].push(temp);
          }
      });
    });
    }
    });
  
      this.menuData.map((obj,i)=>{
        if(obj.subcategories){
        obj.subcategories.map((item,k)=>{

          let _obj =_.filter(that.menuData[i]['subcategories'], function(o) { 
      
             if(o.parent){
                
                return item.id == o.parent;
             }
           });      
          if(_obj){ 
            item['subcategories']=_obj; 
            _obj.map((sp,k)=>{
              let _objIndx =_.findIndex(that.menuData[i]['subcategories'], function(o) { return item.id == o.parent; });
              that.menuData[i]['subcategories'].splice(_objIndx,1); 
            });           
          }
        });
      }
      });
    const menuInfo={catgories:this.menuData};
    this.singletonServ.menudata=this.menuData;
    this.singletonServ.sendMessage(menuInfo);
  },(error)=>{
  })
  }


  onSidemenutap(event){
    event.stopPropagation();
    this.sidemenuStatus=!this.sidemenuStatus;
      const toggle ={
        moltonSideumenu:{
        state:this.sidemenuStatus
      }
    };
     this.singletonServ.sendMessage(toggle);
  }

  onhidesubmenu(){
    this.mouseEnter=false;
  }
  toggleMenu(event){
    this.sidemenuStatus=!this.sidemenuStatus;
      const toggle ={
        moltonSideumenu:{
        state:this.sidemenuStatus
      }
    };
     this.singletonServ.sendMessage(toggle);    
   
  }
  swipMenu(event){

      const toggle ={
        moltonSideumenu:{
        state:false
      }
    };
     this.singletonServ.sendMessage(toggle);
     this.sidemenuStatus=false;
  }
  onHoverCategory (item,i){
    if(item.name !='Editorial'){
      this.mouseEnter =true;
        this.menuData.map((obj,id)=>{
          if(id==i){
            obj.bg = true;
          }else{
            obj.bg =false;
          }
        }); 
        this.submenuData =item.subcategories;        
  }else{
    this.menuData.map((obj,id)=>{
      if(id==i){
        obj.bg = true;
      }else{
        obj.bg =false;
      }
    }); 
    this.mouseEnter=true;
  }
  }
  onmouseLeave(){
    this.menuData.map(obj=>{
      obj.bg=false;
    })
  }
    mouseLeave(){
      this.mouseEnter=false;
  }
  goToHome(){
    this.router.navigate(['/store']);
  }
  onBlurSearchIcon(){
    
  }
  onBlurSearch(text){
    if(this.searchResultValue.length >=4){
      this.searchCtgry=true;
      this.searchBlock=true;
      if(!this.hoverOnSearchBlock){
        this.searchPrdctText='';
        this.searchResultValue='';
        this.searchResults=[];
        this.searchCtgry=false;
        this.searchBlock=false;

      }
    
    
    }else{
      this.searchCtgry=false;
      this.searchBlock=false;
      this.searchPrdctText='';
      this.searchResultValue='';
      this.searchResults=[];
    }
   
  }

  onLeaveSearchBox(){
    this.hoverOnSearchBlock=false;
  }

  onsearchClicked(){
    this.renderer.invokeElementMethod(this.searchField.nativeElement, 'focus');
    this.searchCtgry=true;   
  }

  onSearcKeyUp(event){
    let result=undefined;
    const that=this;
    const _catData=this.singletonServ.menudata;
    if (event.key === "Enter") {

    //   this.searchResultValue=event.target.value;
    // let _searchtextval = event.target.value.toLowerCase().trim();
    // _searchtextval.replace(/[\. ',:-]+/g, "");
    //  const seo=  _searchtextval.replace(/ /g,"");
      // for (let obj of _catData) {
      //   const  data = that.catalogTree(obj, seo);
      //     if (data) {
      //         result =data;
      //         break;
      //     }
      // }
      // if(result){
      //   const catgIndex=result.url.indexOf('/c/');
      //   const prdctIndex=result.url.indexOf('/p/');
      //   if(catgIndex){
      //     let url ='/store'+result.url.replace('/c/','/');
      //   this.router.navigate([url]);
      //   }else if(prdctIndex){
      //     let url ='/store'+result.url.replace('/p/','/');
      //     this.router.navigate([url]);
      //   }
        
      // }else{
        this.onSearchResults();
      // }

    }
  }
  catalogTree(obj, targetId) {
    let name=obj.name.replace(/[\. ',:-]+/g, "").toLowerCase();
    let itemName=name.replace(/[\&]+/g,"").toLowerCase().trim();
      if (itemName == targetId) {
          return obj
      }
      if (obj.subcategories) {
          for (let item of obj.subcategories) {
              let check = this.catalogTree(item, targetId)
              if (check) {
                  return check
              }
          }
      }
      return null

  }
  onSearchChange(searchValue : string ){
    this.searchCtgry=true;
    this.searchResultValue=searchValue;
    const baseSiteid =this.singletonServ.catalogVersionId;
   
   if(searchValue.length >=4){

     this.headerServ.getCategorySearchResults(baseSiteid,searchValue).subscribe((resp)=>{
     if(resp['products']){
      if(resp['products'].length >0){
        this.allProducts=resp['products'];
      this.searchResults=resp['products'].slice(0, 3);

      this.searchCtgry=true;
      this.searchBlock=true;
    }else{
      this.searchResults=[];
      this.searchCtgry=true;
      this.searchBlock=false;
    }
  }else{
    this.searchResults=[];
    this.searchCtgry=true;
    this.searchBlock=false;
  }
     },(err)=>{
      this.searchBlock=false;
     });
  }else{
    this.searchResults=[];
    this.searchCtgry=true;
    this.searchBlock=false;
  }
  }
  showSearchBox(){
    this.searchBlock=true;
    this.hoverOnSearchBlock=true;
    this.searchCtgry=true;
  }
  getImageUrl(data){
    return 'http://i1.adis.ws/s/moltonbrown/'+data.code+'_uk_set?$thImg$&amp;fmt=webp';
  }

  onsidemenusubCategorytapped(trackMenu,sidemenu){
    event.stopPropagation();
    const routname = sidemenu.name.replace(/[\. ',:-]+/g, "").toLowerCase();
    const routeId = sidemenu.id;
    const current_name = trackMenu.name.replace(/[\. ',:-]+/g, "").toLowerCase();
    const current_routeId = trackMenu.id;
    this.singletonServ.menudata=this.menuData;
    this.menuData.map((obj,id)=>{
       obj.bg =false;
    });
   this.mouseEnter=false;
   
   const toggle ={
    moltonSideumenu:{
    state:false
  }
};
 this.singletonServ.sendMessage(toggle); 
 this.sidemenuStatus=false;
   this.router.navigate(['/store',routname,current_name,current_routeId]);
  }

  onCtgrySubTapped(event,data){
    event.stopPropagation();
    this.menuData.map((obj,id)=>{
        obj.bg =false;
     
    });
    this.mouseEnter=false;
    if(data.name !='Editorial'){
    const routname = data.name;
    const routeId = data.id;
    this.singletonServ.menudata=this.menuData;
    this.router.navigate(['/store',routname, routeId]);

    }else{
      this.router.navigate(['store/features/behind-the-fragrance/jasmine-sun-rose']);
    }
  }


  onShowMbCategoryProduct(event,data){
    event.stopPropagation();
    this.menuData.map((obj,id)=>{
        obj.bg =false;
     
    });
    this.mouseEnter=false;
    if(data.name !='Editorial'){
    const routeId = data.id;
    this.singletonServ.menudata=this.menuData;
    window.scrollTo(40,60);
    this.titleService.setTitle(data.titleName);
    this.router.navigate(['/store',data.name, routeId]);

    }else{
      this.router.navigate(['store/features/behind-the-fragrance/jasmine-sun-rose']);
    }
  }
  onAmplienceClick(){
    this.router.navigate(['store/homepage']);
  }

  onShowcategory(event,item){
    event.stopPropagation();
    if(item.subcategories.length==0 ){
      let url ='/store'+item.url.replace('/c/','/');
      this.router.navigate([url]);
    }
  }

  onShowMbSubCategoryProduct(event,current,parent){
    event.stopPropagation();
    this.singletonServ.menudata=this.menuData;
    this.menuData.map((obj,id)=>{
       obj.bg =false;
    });
   this.mouseEnter=false;
   let url ='/store'+current.url.replace('/c/','/');
      this.router.navigate([url]);

  }
  getCategoryDetail(){
    
  }
  onSearchProduct(event,searchItem){
    event.stopPropagation();

    this.searchCtgry=false;
    this.searchBlock=false;
    this.searchPrdctText='';
    this.searchResultValue='';

     const catgIndex=searchItem.url.indexOf('/c/');
     const prdctIndex=searchItem.url.indexOf('/p/');
     if(catgIndex !=-1){
       let url ='/store'+searchItem.url.replace('/c/','/');
     this.router.navigate([url]);
     }else if(prdctIndex !=-1){
       let url ='/store'+searchItem.url.replace('/p/','/');
       this.router.navigate([url]);
     }



    
  }
  onSearchResults(){
    const search=this.searchResultValue;
    this.searchCtgry=false;
    this.searchBlock=false;
    this.searchPrdctText='';
    this.searchResultValue='';
  //   if(this.allProducts){
  //   if(this.allProducts.length ==1){
  //     const product=this.allProducts[0];
  //     const prdctIndex=product.url.indexOf('/p/');
      
  //     if(prdctIndex !=-1){
  //       let url ='/store'+product.url.replace('/p/','/');
  //       this.router.navigate([url]);
  //     }else{
  //       this.router.navigate(['store','browse',search]);
  //     }
  //   }else{
  //     this.router.navigate(['store','browse',search]);
  //   }
  // }else{
  //     this.router.navigate(['store','browse',search]);
  //   }
  this.router.navigate(['store','browse',search]); 
  }
  onViewBasket(event){
  event.stopPropagation()
    this.router.navigate(['store','mbcart']);
  }
}