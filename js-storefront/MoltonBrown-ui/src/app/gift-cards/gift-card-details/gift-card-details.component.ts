import { Component, OnInit } from '@angular/core';
import {PaymentGateWayForm} from '../../forms/paymentCard.form';
import { FormBuilder,FormGroup } from '@angular/forms';
import {SingletonService} from '../../services/singleton.service';
import {GiftCardComponentService} from '../gift-cards.service';
import { Location } from '@angular/common';
import { Router,ActivatedRoute ,NavigationEnd} from '@angular/router';
@Component({
  selector: 'app-gift-card-details',
  templateUrl: './gift-card-details.component.html',
  styleUrls: ['./gift-card-details.component.scss']
})
export class GiftCardDetailsComponent implements OnInit {
  givexForm:FormGroup;
  showBalance:boolean;
  givexInfo:any;
  constructor(public customerForm:PaymentGateWayForm,public cardService:GiftCardComponentService,
    private fb: FormBuilder,public singletonServ:SingletonService,
    public location: Location, public router: Router,public route :ActivatedRoute) { 
    this.givexForm= this.fb.group(customerForm.giftBalance());
  }

  ngOnInit() {
  }
  onSubmitForm(event){
    event.stopPropagation();
    const that =this;
    const cVrsnid = this.singletonServ.catalogVersionId;
    const card=this.givexForm.value;
    this.showBalance=false;
    that.cardService.generateToken().subscribe((token)=>{
      const _token=token['access_token'];
      const _body={
            "giftcardnumber":card.GivexCardNumber,
            "giftcardpin":card.GivexPinNumber
        }
          that.cardService.checkBalance(cVrsnid,_token,_body).subscribe((response)=>{
             this.showBalance=true;
             // const data=response['givexstatus'];
             this.givexInfo=JSON.parse(JSON.stringify(response));
             console.log(this.givexInfo);
             this.singletonServ.giftObj=this.givexInfo
            //  this.router.navigate(['store','giftcards','balanceStatement'],{ queryParams: { _requestid: 188}, queryParamsHandling: 'merge' });
          },(error)=>{

          });
    },(error)=>{

    });
  }
}
