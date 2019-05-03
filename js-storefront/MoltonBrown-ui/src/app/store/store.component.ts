import { Component, OnInit,AfterViewInit ,ViewEncapsulation } from '@angular/core';
import {SingletonService} from '../services/singleton.service';
import { Subscription } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit,AfterViewInit {
  toggleMainMenu:boolean;
  subscription:Subscription;
  slotID = "38476590-9594-4d46-8f5a-c54e293fd094";
  contentDeliveryUrl: any;
  checkoutStatus:boolean;
  constructor(public singletonServ :SingletonService) {
    this.toggleMainMenu=false;
    this.checkoutStatus=this.singletonServ.checkoutStatus;
    this.contentDeliveryUrl = "https://c1.adis.ws/cms/content/query?fullBodyObject=true&query="
      + encodeURIComponent(JSON.stringify({ "sys.iri": "http://content.cms.amplience.com/" + this.slotID }))
      + "&scope=tree&store=csdemo";
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
}
