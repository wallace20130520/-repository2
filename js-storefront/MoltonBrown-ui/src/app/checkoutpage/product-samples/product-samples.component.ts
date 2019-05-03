import { Component, OnInit, AfterViewInit,OnDestroy } from '@angular/core';
import {SingletonService} from '../../services/singleton.service';
import { Location } from '@angular/common';
import { Router,ActivatedRoute ,NavigationEnd} from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import {BasketPageComponentService} from '../basketpage/basketpage.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
@Component({
  selector: 'app-product-samples',
  templateUrl: './product-samples.component.html',
  styleUrls: ['./product-samples.component.scss']
})
export class ProductSamplesComponent implements OnInit,AfterViewInit,OnDestroy {
 tooltipMsg:boolean;
 subscription:Subscription;
 slides :Array<any>;
 slideConfig :any;
 deviceInfo:any;
 mobileDevice:boolean;
 totalAmount:string;
 cart:any;
 sampleEntries:Array<any>;
 showExpress:boolean;
 textlength:number;
 cartCode:string;
 samplesCopy:Array<any>;
 giftBox:boolean;
 giftMsg:boolean;
 giftText:string;
  constructor(public singletonServ:SingletonService,public deviceService: DeviceDetectorService,
    public location: Location, public router: Router,public route :ActivatedRoute,public basketServ:BasketPageComponentService) {
    this.tooltipMsg=false;
    this.totalAmount=singletonServ.totalAmount;
    this.showExpress=false;
    this.textlength=250;
    if(sessionStorage.getItem('customerToken')){
      this.showExpress=true;
   }

   this.fetchCartInfo();
   }
   onChangeText(event){
    let textLength=event.target.value.length;
    this.textlength=250-textLength;

   }
  ngOnInit() {
    this.getDeviceInfo();

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
  const that=this;
  this.basketServ.getCurrentUserCartDetail(baseSiteid,data.token,data.email, data.code).subscribe((resp)=>{
    that.cart=resp;
    that.cartCode=resp['code'];
    that.getSampleProducts();
  },(err)=>{
    
  });
}
fetchBasket(baseSiteid, cartId){
  const that=this;
  this.basketServ.getMBCartDetail(baseSiteid, cartId).subscribe((resp)=>{
    that.cart=resp;
    that.getSampleProducts();
  },(error)=>{

  })
}
  ngAfterViewInit() {
    const that =this;
    const cvsersionId=this.singletonServ.catalogVersionId;
  }
  getSampleProducts(){
    const that=this;
    this.slides=undefined;
    const cvsersionId=this.singletonServ.catalogVersionId;
    this.basketServ.getSampleProducts(cvsersionId).subscribe((resp)=>{
      this.slides=resp['products'];
      console.log(resp);
      this.samplesCopy=resp['products'];
      let _sampleEntry;
      _.map(that.slides,(obj)=>{
         _sampleEntry=_.find(that.cart.entries,(item)=>{
                  return obj.code==item.product.code
         })
      if(_sampleEntry){
        that.slides.map((obj)=>{
          if(_sampleEntry.product.code == obj.code){
            obj['status']="added";            
            obj['disabled'] = true; 
          }else{
            obj['status']="pending";            
            obj['disabled'] = false; 
          }
          
       });
       
      }
    }); 
    },(err)=>{

    })
  }
  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    if(isMobile || isTablet){
     this.mobileDevice=true;
     this.slideConfig= {
       "slidesToShow": 2, 
       "slidesToScroll": 2,
       "dots":false,
       "infinite": false
    };
    }else{
      this.mobileDevice=false;
      this.slideConfig = {
         "slidesToShow": 4,
         "slidesToScroll": 4,
         "dots":false,
         "infinite": false
        };
    }
  }
  
  onContinueShoppingEvent(){
    this.router.navigate(['store','home']);
  }
  onSecureCheckout(){
    const that=this;
    const baseSiteid = this.singletonServ.catalogVersionId;
    // that.basketServ.generateCartToken().subscribe((token)=>{
    //   const tokenId = token['access_token'];
    //   const body={
    //     "isGiftBox":this.giftBox,
    //     "isGiftBoxMessage":this.giftMsg,
    //     "giftBoxMessage":this.giftText
    // }
        if(sessionStorage.getItem('customerToken')){   
    //       const user =JSON.parse(sessionStorage.getItem('customerToken'));
    //       that.basketServ.giftMessage(baseSiteid,tokenId,body,user.email,user.code).subscribe((response)=>{

      
          that.singletonServ.checkoutStatus=true;
        const obj={checkoutStatus:true};
        that.singletonServ.sendMessage(obj);
        that.router.navigate(['/checkout','shipping']);
      // },(err)=>{
            
      // })
      }else{
        that.singletonServ.checkoutStatus=true;
        const obj={checkoutStatus:true};
        that.singletonServ.sendMessage(obj);
        that.router.navigate(['/checkout']);
      }

  // },(err)=>{});
 }
  showTooltip(event,index){
    this.slides.map((obj,k)=>{
      if(index == k){
        obj['action']=!obj['action'];
      }else{
        obj['action']=false;;
      }
    })
  }
  onGiftBoxSChecked(event){
    if(this.giftBox){
      
    }else{
      this.giftMsg=false;
      this.tooltipMsg=false;
    }
  }
  showTextarea(event){
    this.tooltipMsg=!this.tooltipMsg;
  }
  onExpressCheckout(){
    this.router.navigate(['checkout','shipping'],{ queryParams: { expressCheckout: true,express:true}, queryParamsHandling: 'merge' });
  }
  onAddItem(data,k){
    const that=this;
    const baseSiteid =this.singletonServ.catalogVersionId;
    if(sessionStorage.getItem('customerToken')){
      const user =JSON.parse(sessionStorage.getItem('customerToken'));
      const logged=true;
        if(!user.code){
          const tokenId =user['token']
          // that.createCart(data,baseSiteid, tokenId,logged);
        }else{
          const tokenId =user['token'];
         this.storeCurrentUserBasket(baseSiteid,data,tokenId,user.code,user.email,k);
        }

    }else
      if (sessionStorage.getItem('cartGUID')) {
        this.addItemToBasket(data,k);     
    }
  }
  addItemToBasket(data,k){
    const that =this;
    const cartDetail = JSON.parse(sessionStorage.getItem('cartGUID'));
    const cartId = '/'+cartDetail['guid'];


    const productObj = {
        "product": { "code": data['code'] },
        "quantity": 1
    };
    const baseSiteid = this.singletonServ.catalogVersionId;
    that.basketServ.generateCartToken().subscribe(res=>{
      const tokenId = res['access_token'];
      that.UpdateBasket(baseSiteid, cartId, productObj, tokenId,k);

    },error=>{

    });

  
  }
  UpdateBasket(baseSiteid, cartId, prodObj, tokenId,k){
  
    this.basketServ.storeProductsToCart(baseSiteid, cartId, prodObj, tokenId).subscribe((cart) => {
      this.slides[k]['entryNumber']=cart['entry']['entryNumber'];
      const obj={
        sample:this.slides[k]
      };
      this.slides.map((obj)=>{

        if(prodObj.product.code == obj.code){

          obj['status']="added";
          obj['disabled'] = true; 
        }else{
          obj['status']="pending";
          obj['disabled'] = false; 
        }
     });
      this.fetchCartInfo();
  }, error => {

  })
  }
  storeCurrentUserBasket(baseSiteid,item,tokenId,code,_email,k){
    const entry =item['entryNumber'];
    const productObj = {
      "product": { "code": item['code'] },
        "quantity":1
    };
    this.basketServ.storesampleProducts(baseSiteid,productObj,tokenId,code,_email).subscribe((resp)=>{   
      this.slides[k]['email']=_email;
      this.slides[k]['code']=item['code'];
      this.slides[k]['entryCode']=code;
      this.slides[k]['entryNumber']=resp['entry']['entryNumber']; 

      this.slides.map((obj)=>{
        if(item['code'] == obj.code){

          obj['status']="added";
          obj['disabled'] = true; 
        }else{
          obj['status']="pending";
          obj['disabled'] = false; 
        }
     });


     this.fetchCartInfo();
    },(error)=>{
      const data =JSON.parse(sessionStorage.getItem('customerToken'));
    });
  }


  onRemoveItem(data,k){
      if(sessionStorage.getItem('customerToken')){
           this.onRemoveSampleEntry(data,k);
      }else  if (sessionStorage.getItem('cartGUID')) {
          this.onSpliceItem(data,k);
    }

  }
  onRemoveSampleEntry(data,k){
    const that=this;
   const user = JSON.parse(sessionStorage.getItem('customerToken'));
    let cartEntry =  _.find(this.cart["entries"],(obj,k)=>{
      return obj.product.code == data.code ;
    }); 
    if(cartEntry){
    const entry = cartEntry['entryNumber'];
    const code=this.singletonServ.cartObj["code"];
    const baseSiteid = this.singletonServ.catalogVersionId;
    this.basketServ.removeEntry(baseSiteid,user.token,code,user.email,entry).subscribe(res => {

       that.slides.map((obj)=>{
        obj['status']='';            
        obj['disabled'] = false; 
       })
       this.fetchCartInfo();
   }, error => {

   });
  }else{
    that.slides.map((obj)=>{
      obj['status']='';            
      obj['disabled'] = false; 
     });
     this.fetchCartInfo();
  }
}
  onSpliceItem(data,k){
    const that=this;
    const baseSiteid = this.singletonServ.catalogVersionId;
 
    if (sessionStorage.getItem('cartGUID')) {
      const guidData = JSON.parse(sessionStorage.getItem('cartGUID'));
      const cartId = '/' + guidData['guid'];  
      const tokenId = guidData['tokenId'];
      that.basketCount(baseSiteid, cartId,data,tokenId,k);
  }else{    
    that.basketServ.generateCartToken().subscribe(res => {
      const tokenId = res['access_token'];
      const cartId = '/' + res['guid'];
      sessionStorage.removeItem('')
      that.basketCount(baseSiteid, cartId,data,tokenId,k);
    }, error => {
    });
  }
    
  }
  basketCount(baseSiteid, cartId,data, tokenId,index){
    
    const that = this;
    const entries=this.cart["entries"];
    let cartEntry =  _.find(entries,(obj,k)=>{
      return obj.product.code == data.code ;
    }); 
    if(cartEntry){
    const entrynumber = '/' + cartEntry['entryNumber'];
    that.basketServ.removePrdct(baseSiteid, cartId, entrynumber, tokenId).subscribe(res => {
      
      that.slides.map((obj)=>{
        obj['status']='';            
        obj['disabled'] = false; 
       })
       this.fetchCartInfo();
    }, error => {

    });
  }else{
    that.slides.map((obj)=>{
      obj['status']='';            
      obj['disabled'] = false; 
     });
      this.fetchCartInfo();
  }
  }

  ngOnDestroy(){
  }
}
