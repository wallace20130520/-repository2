import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import { SERVER_PATHS, PATH } from '../../app.constant';
 import {InterPolateUrlService} from "../../services/commons/InterPolateUrl.service";
import {of} from 'rxjs';
@Injectable({ providedIn: 'root' })
export class HeaderComponentService  extends InterPolateUrlService{
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
    getCatalogData(cVrsnId) {
        const url = this.interpolateUrl(SERVER_PATHS.DEV + cVrsnId + PATH.catalog );
        return this.http.get<any[]>(url).pipe(map(data => data));
    }
    getampcontent(slotId){
        const url = "https://c1.adis.ws/cms/content/query?fullBodyObject=true&query="
        + encodeURIComponent(JSON.stringify({ "sys.iri": "http://content.cms.amplience.com/" + slotId }))
        + "&scope=tree&store=moltonbrown"
           const headers = new Headers({ 'Content-Type': 'application/json' });
           return this.http.get<any[]>(url).pipe(map(data => data));
    }
    getMBCartDetail(cVrsnId, cartCode) {
        const url = this.interpolateUrl(SERVER_PATHS.DEV + cVrsnId + PATH.GUEST_CART_DETAIL,{cartCode:cartCode})
        return this.http
            .get<any[]>(url).pipe(map(data => data,
                catchError(err => of(err.message))
            ));
    }
    getCurrentUserCartDetail(cVrsnId,token,email, cartId) {
        const url = this.interpolateUrl(SERVER_PATHS.DEV + cVrsnId + PATH.USER_CARTDETAILS,{email:email,cartID:cartId} );
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

    getCurrentUserRelevantCart(cVrsnId,token,email){
        const url = this.interpolateUrl(SERVER_PATHS.DEV + cVrsnId + PATH.REGISTER_CART,{email:email});
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

    
    getCategorySearchResults(baseSiteid,searchValue){
        const url =this.interpolateUrl(SERVER_PATHS.DEV +baseSiteid + PATH.CATEGORY_SEARCH_RESULTS,{searchValue:searchValue});
        return this.http
            .get<any[]>(url).pipe(map(data => data,
                catchError(err => of(err.message))
            ));
    }
}