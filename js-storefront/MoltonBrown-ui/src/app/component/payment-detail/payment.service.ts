import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {SERVER_PATHS, PATH } from '../../app.constant';
import {InterPolateUrlService} from '../../services/commons/InterPolateUrl.service';
@Injectable({
  providedIn: 'root'
})
export class PaymentService extends InterPolateUrlService{
  constructor(private http:HttpClient) {
    super();
  }
  
    getPaymentDetailsService(baseSiteId,token,email): Observable<any>{
      const url=this.interpolateUrl(SERVER_PATHS.DEV + baseSiteId+ PATH.SAVED_CARDS,{email:email});
        
      const httpOptions = {
          headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: 'bearer '+token
          })
      };
      return this.http.get<any[]>(url,httpOptions).pipe(map(data => data));
  }
  generatePaymentToken() {
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

   }

