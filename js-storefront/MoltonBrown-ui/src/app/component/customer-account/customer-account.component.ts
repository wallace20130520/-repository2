import { Component, OnInit } from '@angular/core';
import {SingletonService} from '../../services/singleton.service';
import { Location } from '@angular/common';
import { Router,ActivatedRoute ,NavigationEnd} from '@angular/router';
@Component({
  selector: 'app-customer-account',
  templateUrl: './customer-account.component.html',
  styleUrls: ['./customer-account.component.scss']
})
export class CustomerAccountComponent implements OnInit {
  breadcrumb:Array<any>;
  constructor(public singletonService:SingletonService,
    public location: Location, public router: Router,public route :ActivatedRoute) {

     }

  ngOnInit() {
    this.breadcrumb=['MY ACCOUNT',' MY PROFILE'];
  }
  onContentClick(data){
    if(data=='profile'){

      this.router.navigate(['store','myaccount','profile']);
    } else if(data=='address'){
     this.router.navigate(['store','myaccount','profile','addressBook']);
    } else if(data =='payment'){
      this.router.navigate(['store','myaccount','profile','paymentInfo']);
    } else if(data == 'favourites'){

      this.router.navigate(['store','myaccount','profile','myFavorites']);
    } else if(data=='history'){

      this.router.navigate(['store','myaccount','profile','mbOrderhistory']);
    }
  }
}
