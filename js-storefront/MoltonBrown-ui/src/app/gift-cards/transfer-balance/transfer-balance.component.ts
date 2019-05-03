import { Component, OnInit } from '@angular/core';
import {PaymentGateWayForm} from '../../forms/paymentCard.form';
import { FormBuilder,FormGroup } from '@angular/forms';
import {SingletonService} from '../../services/singleton.service';
import {GiftCardComponentService} from '../gift-cards.service';
import { Location } from '@angular/common';
import { Router,ActivatedRoute ,NavigationEnd} from '@angular/router';
@Component({
  selector: 'app-transfer-balance',
  templateUrl: './transfer-balance.component.html',
  styleUrls: ['./transfer-balance.component.scss']
})
export class TransferBalanceComponent implements OnInit {
  transferForm:FormGroup;
  constructor(public customerForm:PaymentGateWayForm,public cardService:GiftCardComponentService,
    private fb: FormBuilder,public singletonServ:SingletonService,
    public location: Location, public router: Router,public route :ActivatedRoute) { 
      this.transferForm= this.fb.group(customerForm.transferBalance());
    }

  ngOnInit() {
  }
  onSubmitForm(event){
    
  }
}
