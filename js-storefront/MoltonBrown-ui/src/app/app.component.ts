import { Component, OnInit,AfterViewInit  } from '@angular/core';
import {SingletonService} from './services/singleton.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,AfterViewInit {
  toggleMainMenu:boolean;
  subscription:Subscription;
  contentDeliveryUrl: any;
  checkoutStatus:boolean;
  constructor(public singletonServ :SingletonService) {
    this.toggleMainMenu=false;
    this.checkoutStatus=this.singletonServ.checkoutStatus;

  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.subscription = this.singletonServ.getMessage().subscribe(message => {
      if (message.moltonSideumenu) {
        window.scroll(0, 0);
        this.toggleMainMenu= message.moltonSideumenu.state;
      }else if(message.checkoutStatus !=undefined){
         this.checkoutStatus =message.checkoutStatus;
      }
     })
    }
    scrollHandler(){
    }
}