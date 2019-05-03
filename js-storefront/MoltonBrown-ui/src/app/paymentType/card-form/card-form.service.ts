import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { SERVER_PATHS, PATH } from '../../app.constant';
 import {publish} from  'rxjs/operators';
 import { Headers, RequestOptions } from '@angular/http';
 import {InterPolateUrlService} from '../../services/commons/InterPolateUrl.service';
@Injectable({ providedIn: 'root' })
export class cardFormComponentService extends InterPolateUrlService {
    private headers: Headers;
    http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }
    paymentService(cVrsnid,body,tokenId,cartCode,emailId){
        const url = SERVER_PATHS.DEV + cVrsnid+ '/'+cartCode+'/'+emailId+'/payment';
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

    confirmOrder(cVrsnid,tokenId,body,emailId,cartCode,cvv){
    //  const url = SERVER_PATHS.DEV + cVrsnid+PATH.CREATE_USER_PATH+'/'+emailId+ '/carts/'+cartCode+'/payment?securityCode='+cvv;
    const url=this.interpolateUrl(SERVER_PATHS.DEV + cVrsnid+PATH.REG_DEBIT_PAYMENT.trim(),{email:emailId,cartCode:cartCode});
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
          setDeliveryMode(cVrsnid,tokenId,emailId,cartCode){
            const url = SERVER_PATHS.DEV + cVrsnid+ PATH.CREATE_USER_PATH+'/'+emailId+'/carts/'+cartCode+'/deliverymode?deliveryModeId=standard-gross';
            const httpOptions = {
                headers: new HttpHeaders({            
                    'Content-Type': 'application/json',
                  Authorization: 'bearer '+tokenId
                })
              };
            return this.http
                .put<any[]>(url,JSON.stringify({}),httpOptions)
                .pipe(map(data => data));
          }
          addShippingAddress(cVrsnid,token,shipAddress,email,cartCode){
            const url=SERVER_PATHS.DEV + cVrsnid+ PATH.CREATE_USER_PATH+'/'+email+'/carts/'+cartCode+'/addresses/delivery';
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
          addGuestShippingAddress(cVrsnid,token,shipAddress,_email,cartId){
            const url=this.interpolateUrl(SERVER_PATHS.DEV + cVrsnid+ PATH.GUEST_SHIPPING_ADDRESS.trim(),{cartId:cartId})
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
          setGuestDeliveryMode(cVrsnid,tokenId,emailId,cartGUID){
            const url = this.interpolateUrl(SERVER_PATHS.DEV + cVrsnid+ PATH.GUEST_DELIVERY_MODE.trim(),{cartId:cartGUID})
            const httpOptions = {
                headers: new HttpHeaders({            
                    'Content-Type': 'application/json',
                  Authorization: 'bearer '+tokenId
                })
              };
            return this.http
                .put<any[]>(url,JSON.stringify({}),httpOptions)
                .pipe(map(data => data)); 
          }
          guestPayment(cVrsnid,tokenId,body,cartId){
            const url = this.interpolateUrl(SERVER_PATHS.DEV + cVrsnid+PATH.GUEST_DEBIT_PAYMENT.trim(),{cartId:cartId});
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
}