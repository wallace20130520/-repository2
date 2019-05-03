import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router,ActivatedRoute ,NavigationEnd} from '@angular/router';
import { OrderHistoryService } from './orders.service';
import {SingletonService} from '../../services/singleton.service';
import {PagerService} from '../../services/pager.service';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
public orderHistoryList = [];
order:any;
orderHistoryDetails:boolean;
ordersHistoryList:boolean;viewAllProducts:boolean;
allItems:any=[];
orderItems:any;
pager:any = {};
pagedItems: any[];
pageNumber:number;
pageLoad:boolean;
pagination:any;

pageSize:number=5;
  constructor(public location: Location, public router: Router,public route :ActivatedRoute, 
    private _orderHistoryService: OrderHistoryService,public singletonServ:SingletonService,public pagerService:PagerService) {
      this.ordersHistoryList=true;
      this.viewAllProducts=false; 
      this.pageNumber=0;
      this.pageLoad=false;
      
     }

  ngOnInit() {
    // this._orderHistoryService.getOrderHistoryService()
    // .subscribe(data => this.orderHistoryList = data);
    this.getOrderHistory();
  }

  getOrderHistory(){
    const that=this;
    const cVrsnid=this.singletonServ.catalogVersionId;
    this._orderHistoryService.generateOrderToken().subscribe((token)=>{
       const tokenId = token['access_token']; 
       if(sessionStorage.getItem('customerToken')){
         const user =JSON.parse(sessionStorage.getItem('customerToken'));
         that._orderHistoryService.getOrderHistoryService(cVrsnid,tokenId,user.email).subscribe((response)=>{
           this.order=response;
           that.allItems=response['orders'];
           this.setPage(1);
       },(err)=>{

       })
       }
 
    },(err)=>{

    })
  }
  showOrderHistoryDetails(orderHistory){
    this.ordersHistoryList=false;

    this.router.navigate(['store','myaccount','profile','orderDetails'] ,{ queryParams: { orderId: orderHistory.code}, queryParamsHandling: 'merge' });
  }
  onGoToHome(){
    this.router.navigate(['store','home']);
  }

  setPage(page: number) {
    console.log(page);
    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page,5);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
}
 
onviewAllProducts(page){

  this.pagedItems = this.allItems;

  
}
}
