import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import { SERVER_PATHS, PATH } from '../../app.constant';
 import { Headers } from '@angular/http';
import {of} from 'rxjs';
import {InterPolateUrlService} from '../../services/commons/InterPolateUrl.service';
@Injectable({ providedIn: 'root' })
export class DeliveryComponentService extends InterPolateUrlService {
    private headers: Headers;
    http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }
    getMBCartDetail(cVrsnId, cartCode) {
        const url = this.interpolateUrl(SERVER_PATHS.DEV + cVrsnId + PATH.GUEST_CART_DETAIL.trim(),{cartCode:cartCode});
        return this.http
            .get<any[]>(url).pipe(map(data => data,
                catchError(err => of(err.message))
            ));
    }
    createUserAddress(cVrsnid,body,tokenId,email){
        const url =this.interpolateUrl(SERVER_PATHS.DEV + cVrsnid+ PATH.CREATE_ADDRESS.trim(),{email:email});
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+tokenId
            })
        };
        return this.http
            .post<any[]>(url,JSON.stringify(body), httpOptions)
            .pipe(map(data => data));
    }
    createAnnonymousAddress(cVrsnid,tokenId,cartId,body){
        const url = this.interpolateUrl(SERVER_PATHS.DEV + cVrsnid+ PATH.GUEST_SHIPPING_ADDRESS.trim(),{cartId:cartId});
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+tokenId
            })
        };
        return this.http
            .post<any[]>(url,JSON.stringify(body), httpOptions)
            .pipe(map(data => data));
    }
    generateCartToken() {
        const url = PATH.CART_TOKEN_PATH;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http
            .post<any[]>(url, httpOptions)
            .pipe(map(data => data));
    }
setDeliveryMode(cVrsnid,tokenId,emailId,cartCode){
    const url = SERVER_PATHS.DEV + cVrsnid+ PATH.CREATE_USER_PATH+'/'+emailId+'/carts/'+cartCode+PATH.DELIVERY_MODE_PATH;
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+tokenId
        })
    };
  
    return this.http
    .put<any[]>(url,JSON.stringify({}), httpOptions)
    .pipe(map(data => data));
}

getPostCode(postCode){
    const url=this.interpolateUrl(PATH.FIND_POSTCODE.trim(),{postCode:postCode});
      return this.http
      .post<any[]>(url,  {
              headers: new HttpHeaders()
              .set('Content-Type', 'text/xml') 
              .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS') 
              .append('Access-Control-Allow-Origin', '*')
              .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method")
        })
      .pipe(map(data => data));   
    // return this.http.post(url,  httpOptions).subscribe(result => {
    //   console.log(result);
    // }, error => console.log('There was an error: '));
}
retrievePostalAddress(postCode){
    const url=this.interpolateUrl(PATH.POSTAL_ADDRESS.trim(),{postCode:postCode}); return this.http
    .post<any[]>(url,  {
            headers: new HttpHeaders()
            .set('Content-Type', 'text/xml') 
            .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS') 
            .append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method")
      })
    .pipe(map(data => data));
}

confirmAddress(cVrsnid,tokenId,email,cartCode,addressId){
    const url = this.interpolateUrl( SERVER_PATHS.DEV + cVrsnid+ PATH.CONFIRM_ADDRESS.trim(),{cartCode:cartCode,email:email,addressId:addressId});
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+tokenId
        })
    };
  
    return this.http
    .post<any[]>(url,JSON.stringify({}), httpOptions)
    .pipe(map(data => data));
}
getDeliveryMethod(cVrsnId,tokenId,email,cartCode){
    const url = this.interpolateUrl(SERVER_PATHS.DEV + cVrsnId + PATH.DELIVERY_METHOD.trim(),{email:email,cartCode:cartCode}) ;
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+tokenId
        })
    };
    return this.http
        .get<any[]>(url,httpOptions).pipe(map(data => data,
            catchError(err => of(err.message))
        ));
}
getGuestDeliveryMethod(cVrsnId,tokenId,cartCode){
    const url = this.interpolateUrl(SERVER_PATHS.DEV + cVrsnId + PATH.GUEST_DELIVERY_METHOD.trim(),{cartCode:cartCode}) ;
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+tokenId
        })
    };
    return this.http
        .get<any[]>(url,httpOptions).pipe(map(data => data,
            catchError(err => of(err.message))
        ));
}
deliverymethodToCart(cVrsnid,tokenId,body,deliveryType,email,cartCode){

    const url = this.interpolateUrl( SERVER_PATHS.DEV + cVrsnid+ PATH.DELIVERY_METHOD_TO_CART.trim(),{cartCode:cartCode,email:email,deliverycode:deliveryType.code});
   console.log(url)
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+tokenId
        })
    };
  
    return this.http
    .post<any[]>(url,JSON.stringify(body), httpOptions)
    .pipe(map(data => data));
}

guestDeliverymethodToCart(cVrsnid,tokenId,body,deliveryType,cartCode){
    const url = this.interpolateUrl( SERVER_PATHS.DEV + cVrsnid+ PATH.GUEST_DELIVERY_METHOD_TO_CART.trim(),{cartCode:cartCode,deliverycode:deliveryType.code});
   console.log(url)
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+tokenId
        })
    };
  
    return this.http
    .post<any[]>(url,JSON.stringify(body), httpOptions)
    .pipe(map(data => data));
}

deliveryNamedDayToCart(baseSiteId,tokenId,email,cartCode){
    const url = this.interpolateUrl(SERVER_PATHS.DEV + baseSiteId + PATH.DELIVERY_SERVICE.trim(),{email:email,cartCode:cartCode,baseSiteId:baseSiteId}) ;
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+tokenId
        })
    };
    return this.http
        .get<any[]>(url,httpOptions).pipe(map(data => data,
            catchError(err => of(err.message))
        ));
}

getGuestNamedDayList(baseSiteId,tokenId,cartCode){
    const url = this.interpolateUrl(SERVER_PATHS.DEV + baseSiteId + PATH.GUEST_DELIVERY_SERVICE.trim(),{cartCode:cartCode,baseSiteId:baseSiteId}) ;
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+tokenId
        })
    };
    return this.http
        .get<any[]>(url,httpOptions).pipe(map(data => data,
            catchError(err => of(err.message))
        ));
}


setNamedDeliveryModeToCart(cVrsnId,tokenId,email,cartCode,data){
    const url = this.interpolateUrl( SERVER_PATHS.DEV + cVrsnId+ PATH.DELIVERY_NAMED_DAY_SERVICE.trim(),{cartCode:cartCode,email:email,deliveryCode:data.deliveryCode});
    
    console.log(url);
    const httpOptions = {
         headers: new HttpHeaders({
             'Content-Type': 'application/json',
             'Authorization': 'bearer '+tokenId
         })
     };
   
     return this.http
     .post<any[]>(url,JSON.stringify(data), httpOptions)
     .pipe(map(data => data));
}

setGuestNamedDeliveryModeToCart(cVrsnId,tokenId,cartCode,data){
    const url = this.interpolateUrl( SERVER_PATHS.DEV + cVrsnId+ PATH.SET_DELIVERY_NAMED_DAY_SERVICE.trim(),{cartCode:cartCode,deliveryCode:data.deliveryCode});
    
    console.log(url);
    const httpOptions = {
         headers: new HttpHeaders({
             'Content-Type': 'application/json',
             'Authorization': 'bearer '+tokenId
         })
     };
   
     return this.http
     .post<any[]>(url,JSON.stringify(data), httpOptions)
     .pipe(map(data => data));
}

getInternationalDelivery(cVrsnId,tokenId,email,cartCode,countryCode){
    const url=this.interpolateUrl( SERVER_PATHS.DEV + cVrsnId+ PATH.GET_INTERNATIONAL_DELIVERY_METHOD.trim(),{cartCode:cartCode,email:email,countryCode:countryCode})
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+tokenId
        })
    };
    return this.http
        .get<any[]>(url,httpOptions).pipe(map(data => data,
            catchError(err => of(err.message))
        ));

}

getGuestInternationalDelivery(cVrsnId,tokenId,cartCode,countryCode){
    const url=this.interpolateUrl( SERVER_PATHS.DEV + cVrsnId+ PATH.GUEST_GET_INTERNATIONAL_DELIVERY_METHOD.trim(),{cartCode:cartCode,countryCode:countryCode})
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+tokenId
        })
    };
    return this.http
        .get<any[]>(url,httpOptions).pipe(map(data => data,
            catchError(err => of(err.message))
        ));

}



setInternationalDeliveryToCart(cVrsnId,tokenId,email,cartCode,countryCode){
    const url=this.interpolateUrl( SERVER_PATHS.DEV + cVrsnId+ PATH.SET_INTERNATIONAL_DELIVERY_METHOD.trim(),{cartCode:cartCode,email:email,countryCode:countryCode})
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+tokenId
        })
    };
    return this.http
        .post<any[]>(url,JSON.stringify({countryCode:countryCode}),httpOptions).pipe(map(data => data,
            catchError(err => of(err.message))
        ));

}

setGuestInternationalDeliveryToCart(cVrsnId,tokenId,cartCode,countryCode){
    const url=this.interpolateUrl( SERVER_PATHS.DEV + cVrsnId+ PATH.GUEST_SET_INTERNATIONAL_DELIVERY_METHOD.trim(),{cartCode:cartCode,countryCode:countryCode})
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+tokenId
        })
    };
    return this.http
        .post<any[]>(url,JSON.stringify({countryCode:countryCode}),httpOptions).pipe(map(data => data,
            catchError(err => of(err.message))
        ));

}


addShippingAddress(cVrsnid,token,shipAddress,email,cartCode){
    const url=this.interpolateUrl(SERVER_PATHS.DEV + cVrsnid+ PATH.SHIPPING_ADDRESS.trim(),{email:email,cartCode:cartCode});
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'bearer '+token
        })
    };
    return this.http
        .post<any[]>(url, JSON.stringify(shipAddress),httpOptions)
        .pipe(map(data => data));
  }
}