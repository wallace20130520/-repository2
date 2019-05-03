import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SERVER_PATHS, PATH } from '../app.constant';
 import {publish} from  'rxjs/operators';
 import { Headers, RequestOptions } from '@angular/http';
@Injectable({ providedIn: 'root' })
export class CategoryDetailComponentService {
    private headers: Headers;
    http: HttpClient;
    constructor(http: HttpClient) {
        this.http = http;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }
    getMbProdDetails(id, cVrsnid) {
        const url = SERVER_PATHS.DEV + cVrsnid+ PATH.PRODUCT_DATA_PATH.trim() + id;
        return this.http
            .get<any[]>(url)
            .pipe(map(data => data));
    }
    getrelevantDynamicData(code){
        const url = 'https://i1.adis.ws/s/moltonbrown/' + code + '_uk_set.json';
        return this.http
            .get<any[]>(url)
            .pipe(map(data => data));
    }  
}