import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { SERVER_PATHS, PATH } from '../../app.constant';
 import {publish} from  'rxjs/operators';
 import { Headers, RequestOptions } from '@angular/http';
 
 import {InterPolateUrlService} from "../../services/commons/InterPolateUrl.service";
import {of} from 'rxjs'
@Injectable({ providedIn: 'root' })
export class profileComponentService extends InterPolateUrlService {
    private headers: Headers;
    http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }
    generateToken() {
        const url =PATH.CART_TOKEN_PATH;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http
            .post<any[]>(url, httpOptions)
            .pipe(map(data => data));
    }
    mergeCart(baseSiteid,data,_email,token,oldCartId,newCartId){
        const url = this.interpolateUrl(SERVER_PATHS.DEV + baseSiteid+PATH.MERGE_CART.trim(),{email:_email,oldCartId:oldCartId,newCartId:newCartId});
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization':'bearer '+token
                
            })
        };
        return this.http
            .post<any[]>(url,JSON.stringify(data),httpOptions)
            .pipe(map(data => data));
    }
    createUser(cVrsnid,body,tokenId){
        const url = SERVER_PATHS.DEV + cVrsnid+ PATH.CREATE_USER_PATH.trim();
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
    getUserData(cVrsnid,tokenId,email){
        const url = this.interpolateUrl(SERVER_PATHS.DEV + cVrsnid+ PATH.PROFILE.trim(),{email:email});
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+tokenId
            })
        };
        return this.http
            .get<any[]>(url,httpOptions)
            .pipe(map(data => data));
    }
    createUserAddress(cVrsnid,body,tokenId,email){
        const url = this.interpolateUrl( SERVER_PATHS.DEV + cVrsnid+ PATH.CREATE_ADDRESS.trim(),{email:email});
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
    siteAuthentication(cVrsnid,user){
        const url =this.interpolateUrl(PATH.SITE_AUTENTICATION.trim(),{uid:user.email,password:user.password,siteId:cVrsnid});
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                
            })
        };
        return this.http
            .post<any[]>(url,httpOptions)
            .pipe(map(data => data));
    }
    siteanonymousAuth(cVrsnid,cart,user){
        const url = SERVER_PATHS.DEV +cVrsnid+PATH.ANANONYMOUSCART+'/'+cart['guid']+'/email?email='+user.email;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+cart['tokenId']
            })
        };
        return this.http
            .put(url,JSON.stringify({}),httpOptions)
            .pipe(map(data => data));
            
    }
    getUserAddress(cVrsnid,token,email){
        const url =this.interpolateUrl( SERVER_PATHS.DEV + cVrsnid+ PATH.CREATE_ADDRESS.trim(),{email:email});
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+token
            })
        };
        return this.http
        .get<any[]>(url,httpOptions)
        .pipe(map(data => data));
    }
    updateUserAddress(cVrsnid,body,tokenId,email,addressId){
        const url =this.interpolateUrl( SERVER_PATHS.DEV + cVrsnid+ PATH.UPDATE_ADDRESS.trim(),{email:email,addressId:addressId});
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+tokenId
            })
        };
        return this.http
        .put<any[]>(url,JSON.stringify(body),httpOptions)
        .pipe(map(data => data));
    }
    creatEmptyCart(baseSiteid,token,data,email){
        const url = this.interpolateUrl(SERVER_PATHS.DEV + baseSiteid + PATH.REGISTER_CART.trim(),{email:email} );
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization':'bearer '+token
                
            })
        };
        return this.http
            .post<any[]>(url,JSON.stringify(data),httpOptions)
            .pipe(map(data => data));
    }

    getCurrentUserRelevantCart(baseSiteid,token,email){
        const url = this.interpolateUrl(SERVER_PATHS.DEV + baseSiteid + PATH.REGISTER_CART.trim(),{email:email});
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization':'bearer'+token
                
            })
        };
        return this.http
            .get<any[]>(url,httpOptions).pipe(map(data => data,
                catchError(err => of(err.message))
            ));
    }
    spliceUserAddress(cVrsnid,tokenId,email,addressId){
        const url =this.interpolateUrl( SERVER_PATHS.DEV + cVrsnid+ PATH.UPDATE_ADDRESS.trim(),{email:email,addressId:addressId});
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer'+tokenId
            })
        };
        return this.http.delete(url,httpOptions)
        .pipe(map(data => data,
            catchError(err => of(err.message))
        ));
    }
     handleError(error: HttpErrorResponse) {
    let errMsg = '';
    // Client Side Error
    if (error.error instanceof ErrorEvent) {        
      errMsg = `Error: ${error.error.message}`;
    } 
    else {  // Server Side Error
      errMsg = `Error Code: ${error.status},  Message: ${error.message}`;
    }
    // return an observable
    return throwError(errMsg);
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
}
retrievePostalAddress(postCode){
    const url=this.interpolateUrl(PATH.POSTAL_ADDRESS.trim(),{postCode:postCode});
    return this.http
    .post<any[]>(url,  {
            headers: new HttpHeaders()
            .set('Content-Type', 'text/xml') 
            .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS') 
            .append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method")
      })
    .pipe(map(data => data));
}
updateProfile(cVrsnId,tokenId,email,data){
    const url =this.interpolateUrl( SERVER_PATHS.DEV + cVrsnId +PATH.PROFILE.trim(),{email:email});
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization':'bearer'+tokenId
            
        })
    };
    return this.http
        .put<any[]>(url,JSON.stringify(data),httpOptions).pipe(map(data => data,
            catchError(err => of(err.message))
        ));
}
updateProfileAddress(cVrsnId,tokenId,email,addressId,data){
    const url =this.interpolateUrl( SERVER_PATHS.DEV + cVrsnId +PATH.UPDATE_ADDRESS.trim(),{email:email,addressId:addressId});
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization':'bearer'+tokenId
            
        })
    };
    return this.http
        .patch<any[]>(url,JSON.stringify(data),httpOptions).pipe(map(data => data,
            catchError(err => of(err.message))
        ));
}

createRegisterCart(baseSiteid,tokenId,email){
    const url = this.interpolateUrl(SERVER_PATHS.DEV + baseSiteid + PATH.REGISTER_CART.trim(),{email:email});
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer'+tokenId
        })
    };
    return this.http.post(url, JSON.stringify({}), httpOptions)
        .pipe(map(data => data,
            catchError(err => of(err.message))
        ));
 }

getFavourites(cVrsnId,tokenId,email){
    const url=this.interpolateUrl( SERVER_PATHS.DEV + cVrsnId+PATH.FAVOURITES.trim(),{email:email});
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization':'bearer'+tokenId
            
        })
    };
    return this.http
        .get<any[]>(url,httpOptions).pipe(map(data => data,
            catchError(err => of(err.message))
        ));
}
storeCurrentUserProducts(baseSiteid,item,tokenId,productCode,email){
    const url = this.interpolateUrl(SERVER_PATHS.DEV + baseSiteid + PATH.ADD_TO_BASKET.trim(),{email:email,productCode:productCode});
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer'+tokenId
        })
    };
    return this.http.post(url, JSON.stringify(item), httpOptions)
        .pipe(map(data => data,
            catchError(err => of(err.message))
        ));
 }
 removeFavorite(cVrsnid,tokenId,email,productCode){
    const url = this.interpolateUrl(SERVER_PATHS.DEV + cVrsnid+ PATH.REMOVE_FAVOURITE.trim(),{email:email,productCode:productCode});
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer'+tokenId
        })
    };
    return this.http.delete(url,httpOptions)
    .pipe(map(data => data,
        catchError(err => of(err.message))
    ));
 }
}