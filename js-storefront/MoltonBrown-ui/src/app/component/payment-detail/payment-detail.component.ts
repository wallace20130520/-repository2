import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router,ActivatedRoute ,NavigationEnd} from '@angular/router';
import { PaymentService } from './payment.service';
import {SingletonService} from '../../services/singleton.service';
@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss'],  
  encapsulation: ViewEncapsulation.None
})
export class PaymentDetailComponent implements OnInit {
  // public paymentDetailsList = [];
  payment:any;
  public paymentDetailsList:boolean;
  constructor(public location: Location, public router: Router,public route :ActivatedRoute, 
    private _paymentService: PaymentService,public singletonServ:SingletonService) { 
      this.paymentDetailsList=true;
     
    }

  ngOnInit() {
    this.getPaymentDetails();
  }
  getPaymentDetails(){
    const that=this;
    const cVrsnid=this.singletonServ.catalogVersionId;
    this._paymentService.generatePaymentToken().subscribe((token)=>{
       const tokenId = token['access_token']; 
       if(sessionStorage.getItem('customerToken')){
         const user =JSON.parse(sessionStorage.getItem('customerToken'));
         that._paymentService.getPaymentDetailsService(cVrsnid,tokenId,user.email).subscribe((response)=>{
            this.payment=response;
          console.log(this.payment);
       },(err)=>{

       })
       }
 
    },(err)=>{

    })
  }
}
