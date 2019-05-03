import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class SingletonService {
    private subject = new Subject<any>();
     menudata:Array<any>;
     loggedIn:boolean=false;
     cartCount:number;
     checkoutStatus:boolean;
     totalAmount:any;
     catalogVersionId:string='moltonbrown-uk';
     catalogVersion={
       siteId:'moltonbrown-uk',
       locale:'en-GB'
     };
     cartObj:any;
     confirmOrderObj:any;
     giftObj:any;
     favourites:Array<any>;
         sendMessage(message: any) {
             if(message.siteid){
               this.catalogVersionId=message.siteid;
             }else{
                this.subject.next(message);
             }
    }
 
    clearMessage() {
        this.subject.next();
    }
 
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = [cname, '=', JSON.stringify(cvalue), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
        
      }
      getCookie(cname) {
        const name = cname + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }

    constructor(){
        
    }
};