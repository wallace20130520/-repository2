import { Component, OnInit,ViewEncapsulation,AfterViewInit,ElementRef,ViewChild,Renderer,Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {HeaderComponentService} from '../header/header.service';
import {SingletonService} from '../../services/singleton.service';
import {moltonBrownPolicies,CountryJsonData} from '../../staticpage.constant';
import { Location } from '@angular/common';
import { Router,ActivatedRoute ,NavigationEnd} from '@angular/router';
import * as _ from 'lodash';
import { v } from '@angular/core/src/render3';
declare var AmpCa :any;
declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],  
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements  OnInit,AfterViewInit {
  @ViewChild('mySidenav') sideNav:ElementRef;
  
  @Input() sidemenuStatus:boolean;
  @Input() menuData:any;
  footerData:Array<any>=moltonBrownPolicies;
  toggle:boolean;
  mouseEnter:boolean;
  submenuData:Array<any>;
  catalog:Array<any>=CountryJsonData;
  constructor(public titleService:Title,public renderer:Renderer,public el: ElementRef,public headerServ:HeaderComponentService,public singletonServ:SingletonService,
    public location: Location, public router: Router,public route :ActivatedRoute) {
  }
  ngOnInit() {

  }
  ngAfterViewInit(){  
    this.singletonServ.getMessage().subscribe(message => {
       })     
  }

  onhidesubmenu(){
    this.mouseEnter=false;
  }
  toggleMenu(event){
    event.preventDefault();
    this.sidemenuStatus=false;
      const toggle ={
        moltonSideumenu:{
        state:false
      }
    };
     window.scrollTo(0,0);
     this.sideNav.nativeElement.scrollTo(0,0);
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
  onCtgrySubTapped(event,data){
    event.stopPropagation();
    event.preventDefault();
    this.renderMenu();
    if(data.name !='Editorial'){
    const routname = data.name;
    const routeId = data.id;
    this.singletonServ.menudata=this.menuData;
    this.router.navigate(['/store',routname, routeId]);

    }else{
      this.router.navigate(['store/features/behind-the-fragrance/jasmine-sun-rose']);
    }
  }

  onFooterCntntClick(data){
    this.renderMenu();
    if(data.org){
      this.router.navigate(['store',data.templateName]);
    }else{
      if(data.routename){
      this.router.navigate(['store',data.routename]);
    }
  }
  }
  onShowMbCategoryProduct(event,data){
    event.stopPropagation();
    event.preventDefault();
    this.renderMenu();
    if(data.categoryDisplayName !='Editorial'){
    const routeId = data.id;
    this.singletonServ.menudata=this.menuData;
    // window.scrollTo(40,60);
    this.titleService.setTitle(data.titleName);
    this.router.navigate(['/store',data.name, routeId]);

    }else{
      this.router.navigate(['store/features/behind-the-fragrance/jasmine-sun-rose']);
    }
  }

  onTapNewsLetter(){
    this.renderMenu();
    this.router.navigate(['store','newsletter-sign-up']);
  }

  onShowcategory(event,item){
    event.stopPropagation();
    event.preventDefault();
    if(item.subcategories.length==0 ){
      let url ='/store'+item.url.replace('/c/','/');
      this.router.navigate([url]);
    }
  }

  onShowMbSubCategoryProduct(event,current,parent){
        event.stopPropagation();
        event.preventDefault();
        this.renderMenu();
        if(current.id !='catUKPickMixTravel'){
          let url ='/store'+current.url.replace('/c/','/');
          this.router.navigate([url]);
        }else{
          let url ='/store'+current.url.replace('/c/','/');
          this.router.navigate([url]);
        }
  }
  onTapRegister(){
    this.renderMenu();
    this.router.navigate(['store','myacc','mbRegister']);
  }
  onTapLogin(){
    this.renderMenu();
    this.router.navigate(['store','myacc','mbLogin']);
  }
  renderMenu(){
    this.singletonServ.menudata=this.menuData;
    this.menuData.map((obj,id)=>{
      obj.bg =false;
    });
    this.mouseEnter=false;
  }
  onTapViewAllCat(event,sidemenu){

    event.stopPropagation();
    event.preventDefault();
     this.renderMenu();
      let url ='/store'+sidemenu.url.replace('/c/','/');
      this.router.navigate([url]);
      
   
  }
}