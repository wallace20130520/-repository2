import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { SERVER_PATHS, PATH } from '../../app.constant';
 import {publish} from  'rxjs/operators';
 import { Headers, RequestOptions } from '@angular/http';
 import { of } from 'rxjs';
 import {InterPolateUrlService} from '../../services/commons/InterPolateUrl.service';

@Injectable({ providedIn: 'root' })
export class ConfirmationComponentService extends InterPolateUrlService {
    private headers: Headers;
    http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }
    generateCartToken() {
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
    orderService(cVrsnid,tokenId,order,emailId){
        const url = SERVER_PATHS.DEV + cVrsnid+ PATH.CREATE_USER_PATH+'/'+emailId+'/orders/'+order;
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
    guestOrderService(cVrsnid,tokenId,cartId,cvv){
        const url = this.interpolateUrl(SERVER_PATHS.DEV + cVrsnid+ PATH.GUEST_ORDERCONFIRMATION,{cartId:cartId,cvv:cvv});
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+tokenId
            })
        };
        return this.http
            .post<any[]>(url,JSON.stringify({}),httpOptions)
            .pipe(map(data => data));
    }
    getOrderData(cVrsnid,tokenId,orderId){
        const url = this.interpolateUrl(SERVER_PATHS.DEV + cVrsnid+ PATH.ORDERCONFIRMATION,{orderId:orderId});
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

}