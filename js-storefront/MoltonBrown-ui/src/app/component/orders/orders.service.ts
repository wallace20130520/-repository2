import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {SERVER_PATHS, PATH } from '../../app.constant';
import {InterPolateUrlService} from '../../services/commons/InterPolateUrl.service';
@Injectable()
export class OrderHistoryService extends InterPolateUrlService {
    //private _url: string = "https://10.22.63.60:9002/kaowebservices/v2/moltonbrown-uk/users/USERID/orders";
    constructor(private http:HttpClient) {
           super();
    }
    getOrderHistoryService(baseSiteId,token,email): Observable<any>{
        const url=this.interpolateUrl(SERVER_PATHS.DEV + baseSiteId+ PATH.ORDER_HISTORY_PATH,{email:email});
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'bearer '+token
            })
        };
        return this.http.get<any[]>(url,httpOptions).pipe(map(data => data));
    }

getOrderHistoryDetailService(baseSiteId,token,user,orderId): Observable<any>{
    const url = this.interpolateUrl(SERVER_PATHS.DEV + baseSiteId + PATH.ORDER_HISTORY_DETAILS,{email:user,orderCode:orderId});
   const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'bearer '+token
            })
        };
        return this.http
            .get<any[]>(url, httpOptions)
            .pipe(map(data => data));
        }
    
    generateOrderToken() {
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