import { Component, OnInit } from '@angular/core';
import {profileComponentService} from '../profile-form/profile.service';
import * as _ from 'lodash';
import {SingletonService} from '../../services/singleton.service';
@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {
  favouriteList:Array<any>;
  user:any;
  constructor(public profileServ:profileComponentService,public singletonServ:SingletonService) {

  }
  ngOnInit() {
     const that=this;
     const cVrsnid = this.singletonServ.catalogVersionId;      
     if(sessionStorage.getItem('customerToken')){
           const user= JSON.parse(sessionStorage.getItem('customerToken'));
           this.user=user;
           that.profileServ.generateToken().subscribe((token)=>{
            const tokenId = token['access_token'];
           that.fetchFavourites(cVrsnid,tokenId,user.email);
          },(err)=>{

          });
    }
   
  }
  fetchFavourites(cVrsnid,tokenId,email){
    const that=this;
    that.profileServ.getFavourites(cVrsnid,tokenId,email).subscribe((response)=>{
      that.favouriteList=response['products'];
      that.singletonServ.favourites=response['products'];
  },(err)=>{

  });
  }
  addToBasket(product){
    const that =this;
    const cVrsnid = this.singletonServ.catalogVersionId;
    this.profileServ.generateToken().subscribe((token)=>{
      const tokenId = token['access_token'];
      const productObj = {
        "product": { "code": product['code'] },
          "quantity": 1
      };
      if(that.user.code){
        that.storeProductTocart(cVrsnid,productObj,tokenId,that.user.code,that.user.email);
    
    }else{
      that.registerToCart(cVrsnid,productObj,tokenId,that.user.email);
    }
    },(err)=>{

    });
  }
  storeProductTocart(cVrsnid,body,token,code,email){
    this.profileServ.storeCurrentUserProducts(cVrsnid,body,token,code,email).subscribe((response)=>{
      const obj = { updateCart: true,showCartPopUp:true };
      this.singletonServ.sendMessage(obj);
    },(err)=>{

    });
  }
  registerToCart(baseSiteid,body,token,email){
    const that=this;
    this.profileServ.createRegisterCart(baseSiteid,token,email).subscribe((response)=>{
      if(sessionStorage.getItem('customerToken')){
          const user= JSON.parse(sessionStorage.getItem('customerToken'));
          user['code']=response['code'];
          sessionStorage.setItem('customerToken',JSON.stringify(user));
      }
      that.storeProductTocart(baseSiteid,body,token,response['code'],email);
    },(error)=>{

    });
  }
  removeFromWhislist(product){
    const that =this;
    const cVrsnid = this.singletonServ.catalogVersionId;
    this.profileServ.generateToken().subscribe((token)=>{
      const tokenId = token['access_token'];
      if(sessionStorage.getItem('customerToken')){
        const user= JSON.parse(sessionStorage.getItem('customerToken'));
        that.profileServ.removeFavorite(cVrsnid,tokenId,user.email,product.code).subscribe((response)=>{
          that.fetchFavourites(cVrsnid,tokenId,user.email);
        },(error)=>{

        });
    }
    },(err)=>{

    })
  }
}
