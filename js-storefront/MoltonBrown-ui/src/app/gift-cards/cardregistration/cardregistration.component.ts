import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import {PaymentGateWayForm} from '../../forms/paymentCard.form';
import { FormBuilder,FormGroup } from '@angular/forms';
import {SingletonService} from '../../services/singleton.service';
import {GiftCardComponentService} from '../gift-cards.service';
import { Location } from '@angular/common';
import { Router,ActivatedRoute ,NavigationEnd} from '@angular/router';
@Component({
  selector: 'app-cardregistration',
  templateUrl: './cardregistration.component.html',
  styleUrls: ['./cardregistration.component.scss'],    
  encapsulation: ViewEncapsulation.None
})
export class CardregistrationComponent implements OnInit {
  givexForm:FormGroup;
  constructor(public customerForm:PaymentGateWayForm,public cardService:GiftCardComponentService,
    private fb: FormBuilder,public singletonServ:SingletonService,
    public location: Location, public router: Router,public route :ActivatedRoute) { 
      this.givexForm= this.fb.group(customerForm.giftBalance());
    }
  ngOnInit() {
  }
  onSubmitForm(event){
    
  }
}
