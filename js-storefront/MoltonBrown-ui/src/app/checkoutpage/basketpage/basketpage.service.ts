import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { SERVER_PATHS, PATH } from '../../app.constant';
 import {publish} from  'rxjs/operators';
 import { Headers, RequestOptions } from '@angular/http';
 import { of } from 'rxjs';
 import {InterPolateUrlService} from "../../services/commons/InterPolateUrl.service";
@Injectable({ providedIn: 'root' })
export class BasketPageComponentService extends InterPolateUrlService{
    private headers: Headers;
    http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }
    getCurrentUserCartDetail(cVrsnId,token,email, cartId) {
        const url = SERVER_PATHS.DEV + cVrsnId + PATH.CREATE_USER_PATH+'/'+email+'/carts/' + cartId+'/?fields=FULL' ;
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
    getMBCartDetail(cVrsnId, cartId) {
        const url = SERVER_PATHS.DEV + cVrsnId + PATH.CART_PATH + cartId+'/?fields=FULL' ;
        return this.http
            .get<any[]>(url).pipe(map(data => data,
                catchError(err => of(err.message))
            ));
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
    
    patchProductsToCart(baseSiteid, cartId, productObj, entrynumber, tokenId) {
        const url = SERVER_PATHS.DEV + baseSiteid + PATH.CART_PATH + cartId + '/entries' + entrynumber;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+tokenId
            })
        };
        return this.http.patch(url, JSON.stringify(productObj), httpOptions)
            .pipe(map(data => data,
                catchError(err => of(err.message))
            ));
    }

    removePrdct(baseSiteid, cartId, entrynumber, tokenId){
        const url = SERVER_PATHS.DEV + baseSiteid + PATH.CART_PATH + cartId + '/entries' + entrynumber;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer'+tokenId
            })
        };
        return this.http.delete(url)
            .pipe(map(data => data,
                catchError(err => of(err.message))
            ));
    }
    getSampleProducts(cVrsnId){
            const url = SERVER_PATHS.DEV + cVrsnId + PATH.PRODUCT_DATA_PATH +'search?query=:relevance:category:0101&sort=name-asc&fields=FULL';
              return this.http
              .get<any[]>(url)
              .pipe(map(data => data));
            
    }

    storeCurrentUserProducts(baseSiteid,item,tokenId,code,_email,entry){
        const url = SERVER_PATHS.DEV + baseSiteid + PATH.CREATE_USER_PATH+'/'+_email+'/carts/'+code+'/entries/'+entry ;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer'+tokenId
            })
        };
        return this.http.patch(url, JSON.stringify(item), httpOptions)
            .pipe(map(data => data,
                catchError(err => of(err.message))
            ));
    }
    storesampleProducts(baseSiteid,item,tokenId,code,_email){
        const url = SERVER_PATHS.DEV + baseSiteid + PATH.CREATE_USER_PATH+'/'+_email+'/carts/'+code+'/entries' ;
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

    removeEntry(baseSiteid,tokenId,code,_email,entry){
        const url = SERVER_PATHS.DEV + baseSiteid + PATH.CREATE_USER_PATH+'/'+_email+'/carts/'+code+'/entries/'+entry ;
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
    storeProductsToCart(baseSiteid, cartId, productObj, tokenId) {
        const url = SERVER_PATHS.DEV + baseSiteid + PATH.CART_PATH + cartId+'/entries' ;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer'+tokenId
            })
        };
        return this.http.post(url, JSON.stringify(productObj), httpOptions)
            .pipe(map(data => data,
                catchError(err => of(err.message))
            ));
    }
    
  giftMessage(baseSiteid,tokenId,body,email,code){
    const url = this.interpolateUrl(SERVER_PATHS.DEV + baseSiteid + PATH.GIFT_BOX,{email:email,cartCode:code} ) ;
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'bearer'+tokenId
        })
    };
    return this.http.post(url, JSON.stringify(body), httpOptions)
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

}