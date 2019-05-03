import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SERVER_PATHS, PATH } from '../app.constant';
 import {publish} from  'rxjs/operators';
 import { Headers, RequestOptions } from '@angular/http';
@Injectable({ providedIn: 'root' })
export class HomeComponentService {
    private headers: Headers;
    http: HttpClient;
    constructor(http: HttpClient) {
        this.http = http;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }
    getampcontent(slotId,storename){
     const url = "https://c1.adis.ws/cms/content/query?fullBodyObject=true&query="
     + encodeURIComponent(JSON.stringify({ "sys.iri": "http://content.cms.amplience.com/" + slotId }))
     + "&scope=tree&store=1digitals";
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.get<any[]>(url).pipe(map(data => data));
    }
    getrenderserviceTemplate(id,store){
        // const url ="https://c1.adis.ws/v1/content/moltonbrown/content-item/e4f449ee-bac4-490e-a2be-6c92077dc6d1?template=acc-template-card";
        const url = "https://c1.adis.ws/cms/content/query?fullBodyObject=true&query="
        + encodeURIComponent(JSON.stringify({ "sys.iri": "http://content.cms.amplience.com/" + id }))
        + "&store=moltonbrown&?template=acc-template-card"
        return this.http.get<any[]>(url).pipe(map(data => data));
    }
}