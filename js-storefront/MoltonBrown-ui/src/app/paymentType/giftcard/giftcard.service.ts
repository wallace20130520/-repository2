import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { SERVER_PATHS, PATH } from '../../app.constant';
 import {publish} from  'rxjs/operators';
 import { Headers, RequestOptions } from '@angular/http';
 import {InterPolateUrlService} from '../../services/commons/InterPolateUrl.service';
 import { of } from 'rxjs'
@Injectable({ providedIn: 'root' })
export class GiftCardService  extends InterPolateUrlService{
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

    giftCardService(cVrsnid,body,tokenId,email,cartCode){
        const url=this.interpolateUrl(SERVER_PATHS.DEV +cVrsnid+PATH.GIFT_CARD.trim(),{email:email,cartCode:cartCode})
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

    guestGiftCardService(cVrsnid,body,tokenId,cartCode){
        const url=this.interpolateUrl(SERVER_PATHS.DEV +cVrsnid+PATH.GUEST_GIFT_CARD.trim(),{cartCode:cartCode})
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

    splitPayment(cVrsnid,obj,_token,_code,email,card){
        // const url=SERVER_PATHS.DEV +cVrsnid+PATH.CREATE_USER_PATH+'/'+email+'/carts/'+_code+'/giftcard/splitpayment'+'?firstName='+
        // card.FirstName+'&lastName='+card.LastName+'&givexCardNumber='+
        // card.GivexCardNumber.trim()+'&givexPinNumber='+card.GivexPinNumber.trim()+'&amount='+card.Amount.trim();
       
       

       const url=this.interpolateUrl(SERVER_PATHS.DEV +cVrsnid+PATH.REG_SPLIT_PAYMENT.trim(),{email:email,cartCode:_code,firstName:card.FirstName,lastName:card.LastName,givexCardNumber:card.GivexCardNumber.trim(),givexPinNumber:card.GivexPinNumber.trim(),amount:card.Amount.trim()});
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+_token
            })
        };
        return this.http
        .post<any[]>(url,JSON.stringify(obj), httpOptions)
        .pipe(map(data => data));

    }

    guestSplitPayment(cVrsnid,obj,_token,cartCode,card){
        const url=this.interpolateUrl(SERVER_PATHS.DEV +cVrsnid+PATH.GUEST_SPLIT_PAYMENT.trim(),{cartCode:cartCode,firstName:card.FirstName,lastName:card.LastName,givexCardNumber:card.GivexCardNumber.trim(),givexPinNumber:card.GivexPinNumber.trim(),amount:card.Amount.trim()});
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+_token
            })
        };
        return this.http
        .post<any[]>(url,JSON.stringify(obj), httpOptions)
        .pipe(map(data => data));

    }
    addPaymentDetails(cVrsnid,obj,_token,_code,email){
        const url =this.interpolateUrl(SERVER_PATHS.DEV +cVrsnid+PATH.REG_GIVEX_PAYMENT_DETAIL.trim(),{cartCode:_code,email:email})
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+_token
            })
        };
        return this.http
        .post<any[]>(url,JSON.stringify(obj), httpOptions)
        .pipe(map(data => data));
    }

    addGuestPaymentDetails(cVrsnid,obj,_token,_code,email){
        const url =this.interpolateUrl(SERVER_PATHS.DEV +cVrsnid+PATH.GUEST_GIVEX_PAYMENT_DETAIL.trim(),{cartCode:_code,email:email})
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+_token
            })
        };
        return this.http
        .post<any[]>(url,JSON.stringify(obj), httpOptions)
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