import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import { SERVER_PATHS, PATH } from '../app.constant';
 import { Headers, RequestOptions } from '@angular/http';
 import {of} from 'rxjs';
 import {InterPolateUrlService} from "../services/commons/InterPolateUrl.service";
@Injectable({ providedIn: 'root' })
export class CategoryComponentService extends InterPolateUrlService {
    private headers: Headers;
    http: HttpClient;
    constructor(http: HttpClient) {
        super();
        this.http = http;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }
      getMBProduct(categoryCode,cVrsnId,pageSize){
        const url = this.interpolateUrl(SERVER_PATHS.DEV + cVrsnId + PATH.CATEGORY_PRODUCTS.trim(),{categoryCode:categoryCode,pageSize:pageSize});
        return this.http
        .get<any[]>(url).pipe(map(data => data,
          catchError(err => of(err.message))
      ));
      }
      getMbProdDetails(productCode){
        const url = this.interpolateUrl(SERVER_PATHS.DEV+PATH.PRODUCT_DETAIL.trim(),{productCode:productCode});
        return this.http
        .get<any[]>(url).pipe(map(data => data,
          catchError(err => of(err.message))
      ));
      }
    getCategorySearchResults(searchValue,baseSiteid,pageSize){
      const url =this.interpolateUrl(SERVER_PATHS.DEV +baseSiteid + PATH.CATEGORY_SEARCH_PRODUCTS.trim(),{searchValue:searchValue,pageSize:pageSize});
      return this.http
          .get<any[]>(url).pipe(map(data => data,
              catchError(err => of(err.message))
          ));
  }
  
}