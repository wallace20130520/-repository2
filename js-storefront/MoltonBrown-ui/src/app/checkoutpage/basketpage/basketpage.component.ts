import { Component, OnInit, AfterViewInit } from '@angular/core';
import {BasketPageComponentService} from './basketpage.service';
import {SingletonService} from '../../services/singleton.service';
import { Location } from '@angular/common';
import { Router,ActivatedRoute ,NavigationEnd} from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-basketpage',
  templateUrl: './basketpage.component.html',
  styleUrls: ['./basketpage.component.scss']
})
export class BasketpageComponent implements OnInit,AfterViewInit {
  toggle:boolean;
  subscription:Subscription;
  deviceInfo:any;
  mobileDevice:boolean;
  entries:boolean;
  cart:any;
  cartCode:any;
    slides = [
    {img: "https://media.moltonbrown.co.uk/i/moltonbrown/NYD050_uk_Orange-Bergamot-Hand-Cream-40ml_image_01?$smallImg$&fmt=webp",name:'Orange  Bergamot Hand Cream',action:true, "star": 4},
    {img: "https://media.moltonbrown.co.uk/i/moltonbrown/NYD104_uk_Delicious-Rhubarb-Rose-Hand-Cream-40ml_image_01?$smallImg$&fmt=webp",name:'Delicious Rhubarb  Rose Hand Cream',action:true, "star": 4},
    {img: "https://media.moltonbrown.co.uk/i/moltonbrown/MSB073_uk_Vitamin-Lip-Saver-10ml_image_01?$smallImg$&fmt=webp",name:'Vitamin Lipsaver',action:true, "star":3},
    {img: "https://media.moltonbrown.co.uk/i/moltonbrown/MSB073_uk_Vitamin-Lip-Saver-10ml_image_01?$smallImg$&fmt=webp",name:'Vitamin Lipsaver',action:true, "star":5},
    {img: "https://media.moltonbrown.co.uk/i/moltonbrown/MSB073_uk_Vitamin-Lip-Saver-10ml_image_01?$smallImg$&fmt=webp",name:'Vitamin Lipsaver',action:true, "star":4},
    
  ];
  slideConfig :any;
  slideConfig2:any;
  cartTitle:'LAST MINUTE TREAT?';
  constructor(public basketServ :BasketPageComponentService,public singletonServ:SingletonService,
    public location: Location, public router: Router,public route :ActivatedRoute,public deviceService: DeviceDetectorService,) {
    this.entries=false;
    
   }
    ngAfterViewInit(){
      this.subscription = this.singletonServ.getMessage().subscribe(message => {
        if(message.refreshBasket){
          this.fetchCartInfo();
        }
      });
    }
  ngOnInit() {
    // this.getDeviceInfo(); 
    this.fetchCartInfo();
  }
  fetchCartInfo(){
    const baseSiteid =this.singletonServ.catalogVersionId
    if(sessionStorage.getItem('customerToken')){
      const data =JSON.parse(sessionStorage.getItem('customerToken'));
      this.singletonServ.loggedIn=true;
      if(data.code){
       this.fetchcurrentuserBasket(data);
      }
  }else{
    if (sessionStorage.getItem('cartGUID')){
      const data = JSON.parse(sessionStorage.getItem('cartGUID'));
      const cartId = '/' + data['guid'];
      this.fetchBasket(baseSiteid, cartId);
  }

  }
  }
  fetchcurrentuserBasket(data){
    const baseSiteid =this.singletonServ.catalogVersionId;
    
    this.basketServ.getCurrentUserCartDetail(baseSiteid,data.token,data.email, data.code).subscribe((resp)=>{
      this.cart=resp;
      this.cartCode=resp['code'];
      const _obj={
        entries:resp
      }
      this.singletonServ.sendMessage(_obj);
      this.entries=true;
    },(err)=>{
      
    });
  }
  // getDeviceInfo() {
  //   this.deviceInfo = this.deviceService.getDeviceInfo();
  //   const isMobile = this.deviceService.isMobile();
  //   const isTablet = this.deviceService.isTablet();
  //   const isDesktopDevice = this.deviceService.isDesktop();
  //   if(isMobile || isTablet){
  //    this.mobileDevice=true;
  //    this.slideConfig = {"slidesToShow": 1, infinite: true, "slidesToScroll": 1, star: '<div class="star"></div>', 'title':'LAST MINUTE TREAT?'};
  //    this.slideConfig2 = {"slidesToShow": 1, infinite: true, "slidesToScroll": 1, star: '<div class="star"></div>', 'title':'CUSTOMERS ALSO BOUGHT'};
  //   }else{
  //     this.mobileDevice=false;
  //     this.slideConfig = {"slidesToShow": 2, infinite: true, "slidesToScroll": 2, star: '<div class="star"></div>', 'title':'LAST MINUTE TREAT?'};
  //     this.slideConfig2 = {"slidesToShow": 2, infinite: true, "slidesToScroll": 2, star: '<div class="star"></div>', 'title':'CUSTOMERS ALSO BOUGHT'};
  //   }
  // }
  fetchBasket(baseSiteid, cartId){
    this.basketServ.getMBCartDetail(baseSiteid, cartId).subscribe((resp)=>{
      this.cart=resp;
      const _obj={
        entries:resp
      }
      this.singletonServ.sendMessage(_obj);
      this.entries=true;
    },(error)=>{

    })
  }
  onChangeQuant(product,k){
    this.onAddItem(product,k);
  }
  getImageUrl(data){
    return 'http://i1.adis.ws/s/moltonbrown/'+data.product.code+'_uk_set?$smallImg$&amp;fmt=webp';
  }
  setSrcSet(data){
    return 'http://i1.adis.ws/s/moltonbrown/'+data.product.code+'_uk_set?$smallImg$&amp;fmt=webp 1x, http://i1.adis.ws/s/moltonbrown/'+data.code+'_uk_set?$smallImg$&amp;fmt=webp 2x';
  }






  getProductAmount(){
    let sum = 0;
    // for ( let i = 0; i < this.cart['entries'].length; i++) {
    //     sum += this.cart['entries'][i]["totalPrice"]["value"] * this.cart['entries'][i]["quantity"];
    // }
    if(this.cart){
      sum=this.cart.totalPriceWithTax.value
    }
    return sum;
  }
  onRemoveEntry(data,tokenId,email){
    const that=this;
    const baseSiteid = this.singletonServ.catalogVersionId;
    this.basketServ.removeEntry(baseSiteid,tokenId,this.cartCode,email,data['entryNumber']).subscribe((resp)=>{
      data['code']=this.cartCode;
      data['token']=tokenId;
      data['email']=email;
      const obj = { updateCart: true };
      this.singletonServ.sendMessage(obj);
      this.fetchcurrentuserBasket(data);
    },(err)=>{

    });
  }
  onSpliceItem(data){
    const that=this;
    const baseSiteid = this.singletonServ.catalogVersionId;
    if(sessionStorage.getItem('customerToken')){
      const user =JSON.parse(sessionStorage.getItem('customerToken'));
      const tokenId =user['token'];
      this.onRemoveEntry(data,tokenId,user.email);
    }
    else 
    if (sessionStorage.getItem('cartGUID')) {
      const guidData = JSON.parse(sessionStorage.getItem('cartGUID'));
      const cartId = '/' + guidData['guid'];
      const entrynumber = '/' + data['entryNumber'];  
      that.basketServ.generateCartToken().subscribe(res => {
      const tokenId = res['access_token'];
      that.basketCount(baseSiteid, cartId,entrynumber,tokenId);
    }, error => {
    });
  }
    
  }
  basketCount(baseSiteid, cartId, entrynumber, tokenId){
    const that = this;
    that.basketServ.removePrdct(baseSiteid, cartId, entrynumber, tokenId).subscribe(res => {
      const obj = { updateCart: true };
      this.singletonServ.sendMessage(obj);
      this.fetchBasket(baseSiteid, cartId);
    }, error => {

    });
  }
  onDecreaseCount(data,k){
    const that=this;
    const baseSiteid =this.singletonServ.catalogVersionId;
    let _count = this.cart['entries'][k]['quantity']-1;

    if(sessionStorage.getItem('customerToken')){
      // this.cart['entries'][k]['quantity'] = this.cart['entries'][k]['quantity'] -1;
     
      const user =JSON.parse(sessionStorage.getItem('customerToken'));
      const logged=true;
        if(!user.code){
          const tokenId =user['token']
          // that.createCart(data,baseSiteid, tokenId,logged);
        }else{
          const tokenId =user['token'];
          if(this.cart['entries'][k]['quantity'] ==1){
            this.onRemoveEntry(data,tokenId,user.email);
         }else{
        
          this.storeCurrentUserBasket(baseSiteid,data,tokenId,user.code,user.email,k,_count);
         }
      }

    }else
    if (sessionStorage.getItem('cartGUID')) {
      // this.cart['entries'][k]['quantity'] = this.cart['entries'][k]['quantity'] - 1;
      if(this.cart['entries'][k]['quantity'] ==1){
        this.onSpliceItem(data);
    }  else{
    
      this.addItemToBasket(data, k,_count);
    } 
  }
    
  }
  onAddItem(data,k){
    const that=this;
    const baseSiteid =this.singletonServ.catalogVersionId;
    let _count = this.cart['entries'][k]['quantity']+1;
    if(sessionStorage.getItem('customerToken')){
      // this.cart['entries'][k]['quantity'] = this.cart['entries'][k]['quantity'] + 1;
      const user =JSON.parse(sessionStorage.getItem('customerToken'));
      const logged=true;
        if(!user.code){
          const tokenId =user['token']
          // that.createCart(data,baseSiteid, tokenId,logged);
        }else{
          const tokenId =user['token'];
         this.storeCurrentUserBasket(baseSiteid,data,tokenId,user.code,user.email,k,_count);
        }

    }else
      if (sessionStorage.getItem('cartGUID')) {
        // this.cart['entries'][k]['quantity'] = this.cart['entries'][k]['quantity'] + 1;
        this.addItemToBasket(data,k,_count);
     
    }

  }
  storeCurrentUserBasket(baseSiteid,item,tokenId,code,_email,id,_count){
 
    const entry =item['entryNumber'];
    const productObj = {
      "product": { "code": item['product']['code'] },
        "quantity": parseInt(_count)
    };
    this.basketServ.storeCurrentUserProducts(baseSiteid,productObj,tokenId,code,_email,entry).subscribe((resp)=>{
          item['count'] =parseInt(this.cart['entries'][id]['quantity']);
          const obj = { updateCart: true };
          this.singletonServ.sendMessage(obj);
          const data =JSON.parse(sessionStorage.getItem('customerToken'));
          this.fetchcurrentuserBasket(data);
    },(error)=>{
      const data =JSON.parse(sessionStorage.getItem('customerToken'));
      this.fetchcurrentuserBasket(data);
    });
  }

  addItemToBasket(data,k,_count){
    const that =this;
    const cartDetail = JSON.parse(sessionStorage.getItem('cartGUID'));
    const cartId = '/'+cartDetail['guid'];

    const productObj = {
      "quantity": parseInt(_count)
    };
    const entrynumber = '/' + data['entryNumber'];
    const baseSiteid = this.singletonServ.catalogVersionId;
    that.basketServ.generateCartToken().subscribe(res=>{
      const tokenId = res['access_token']; 
      that.UpdateBasket(baseSiteid, cartId, productObj, entrynumber, tokenId);
      
    },error=>{

    });

  
  }
  UpdateBasket(baseSiteid, cartId, productObj, entryNumber, tokenId){
    this.basketServ.patchProductsToCart(baseSiteid, cartId, productObj, entryNumber, tokenId).subscribe(res => {
     
      this.fetchBasket(baseSiteid, cartId);
      const obj = { updateCart: true };
      this.singletonServ.sendMessage(obj);
    }, error => {

    })
  }
  onContinueShoppingEvent(){
    this.router.navigate(['store','home']);
  }
 
  onSecureCheckout(){
    window.scrollTo(0,0);
    this.router.navigate(['store','mbcart','mbSamples']);
  }
  onShowProductDtls(searchItem){
  //   let uri=searchItem.url.replace(/[\. ',:-]+/g, "");
  //    const prodUrl=  uri.substr(1).replace('/p/','/').split('/');
  //    if(prodUrl.length ==4){
  //   const routname = prodUrl[0].replace(/[\. ',:-]+/g, "");
  //   const product_name = prodUrl[1].replace(/[\. ',:-]+/g, "");
  //   const current_name = prodUrl[2].replace(/[\. ',:-]+/g, "");
  //   const current_routeId = prodUrl[3];
  //   this.router.navigate(['/store',routname,product_name,current_name,current_routeId]);
  // }
      let url='/store'+searchItem.url.replace("/p/", "/");
      this.router.navigate([url]);
  }
}
