import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import { SERVER_PATHS, PATH } from '../../../app.constant';
 import {publish} from  'rxjs/operators';
 import { Headers, RequestOptions } from '@angular/http';
import {of} from 'rxjs';
import {InterPolateUrlService} from '../../../services/commons/InterPolateUrl.service';
@Injectable({ providedIn: 'root' })
export class StorePointComponentService extends  InterPolateUrlService{
    private headers: Headers;
    http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }
   getGFSData(cVrsnid,cartCode,postalCode){
        const url = this.interpolateUrl(SERVER_PATHS.DEV + cVrsnid+ PATH.GFS_PATH,{cartCode:cartCode,postalCode:postalCode});
        // const httpOptions = {
        //     headers: new HttpHeaders({
        //         'Content-Type': 'application/json',
        //         'Authorization': 'bearer '+tokenId
        //     })
        // };
        return this.http
            .get<any[]>(url)
            .pipe(map(data => data));
    }
}