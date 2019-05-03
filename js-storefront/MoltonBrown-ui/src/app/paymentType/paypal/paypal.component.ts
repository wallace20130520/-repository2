import { Component, OnInit ,ViewEncapsulation,Input,OnChanges, SimpleChange} from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { Location } from '@angular/common';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss'],  
  encapsulation: ViewEncapsulation.None
})
export class PaypalComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;
  showSuccess:boolean;
  @Input() cartData:any;
  @Input() deliveryInfo:any;
  totalAmount:string;
  entires:Array<any>;
  constructor( public router: Router,public route :ActivatedRoute,public location:Location) { }
  ngOnInit() {
    this.initConfig();
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange })  {
    const that =this;
    
    if (changes['cartData']){
      if (changes['cartData']['currentValue'] != undefined){
        this.getTotalAmount();
        if(changes['cartData']['currentValue'].entries){
          const entries =[];
          changes['cartData']['currentValue'].entries.map((resp)=>{
            let obj=  {
              name: resp.product.name,
              quantity: resp.quantity.toString(),
              unit_amount: {
                currency_code: 'EUR',
                value: resp.quantity*resp.totalPrice.value,
              },
            }
            entries.push(obj);
          });
          that.entires=entries;
        }
      }
    }
  }
   initConfig(): void {
     const that =this;
    this.payPalConfig = {
    currency: 'EUR',
    clientId: 'AYh5ZP68K9ZY3skYtJi6VcJWP0mdyMlZEyPh0bcBEcRw0uxI0-Ei42wQOpHtrfmSfzWyqvBoMmdazP2V',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: this.totalAmount,
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: this.totalAmount
              }
            }
          },
          items: that.entires
        }
      ]
    },
    advanced: {
      
    },
    style: {
      label: 'paypal',
      layout: 'horizontal'
    },
    onApprove: (data, actions) => {
      alert('approved');
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      
      that.router.navigate(['checkout','confirmation']);
      actions.order.get().then(details => {
        alert('done');
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      this.showSuccess = true;
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
    },
    onError: err => {
      console.log('OnError', err);
    },
    onClick: () => {
      console.log('onClick');
    },
  };
  }
  getTotalAmount(){
    const that=this;
    let sum=0;
    for (let i = 0; i < that.cartData['entries'].length; i++) {
      sum += that.cartData['entries'][i]['quantity']*that.cartData['entries'][i]['totalPrice']['value'];
   }
   that.totalAmount= sum.toString();
  }
}
