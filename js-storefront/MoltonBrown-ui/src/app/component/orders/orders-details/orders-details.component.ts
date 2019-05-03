import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute ,NavigationEnd} from '@angular/router';
import { OrderHistoryService } from '../orders.service';
import {SingletonService} from '../../../services/singleton.service';
import { from } from 'rxjs';


@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss']
})
export class OrdersDetailsComponent implements OnInit {
  orderDetail:any;
  constructor(public router: Router,public route :ActivatedRoute, public singletonServ:SingletonService,private _orderHistoryService: OrderHistoryService ) {
    
   }

  ngOnInit() {
    const orderId = this.route.snapshot.queryParamMap.get("orderId");
    const cVrsnid=this.singletonServ.catalogVersionId;
    this._orderHistoryService.generateOrderToken().subscribe((token)=>{
      const tokenId = token['access_token']; 
      if(sessionStorage.getItem('customerToken')){
        const user =JSON.parse(sessionStorage.getItem('customerToken'));
      this._orderHistoryService.getOrderHistoryDetailService(cVrsnid,tokenId,user.email,orderId).subscribe((response)=>{
       this.orderDetail=response;
       
      },(err)=>{

      })
    }
  })
     
  }

}
