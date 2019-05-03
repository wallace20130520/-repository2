import {Injectable} from '@angular/core';
import {FormControl, Validators } from '@angular/forms';
import { patternValidator } from './pattern-validator';
@Injectable({
  providedIn: 'root'
})
export class PaymentGateWayForm {
  getCardForm(){
      return {
        cardType:['',Validators.required],
        cardNumber:new FormControl('',[Validators.required,patternValidator(/[0-9\+\-\ ]/)]),
        firstName:['',Validators.required],
        lastName:['',Validators.required], 
        month:['',Validators.required], 
        year:['',Validators.required],
        cvv:['',Validators.required],
        communication:[''],
        terms:['']  
      }
  }
  getGiftForm(){
    return {
      FirstName:['',Validators.required],
      LastName:['',Validators.required], 
      GivexCardNumber:new FormControl('',[Validators.required,patternValidator(/[0-9\+\-\ ]/)]),
      GivexPinNumber:new FormControl('',[Validators.required,patternValidator(/[0-9\+\-\ ]/)]),
      Amount:new FormControl('',[Validators.required,patternValidator(/[0-9]/)])
    }
  }
  getSpliForm(){
    return {
      FirstName:['',Validators.required],
      LastName:['',Validators.required], 
      GivexCardNumber:new FormControl('',[Validators.required,patternValidator(/[0-9\+\-\ ]/)]),
      GivexPinNumber:new FormControl('',[Validators.required,patternValidator(/[0-9\+\-\ ]/)]),
      Amount:new FormControl('',[Validators.required,patternValidator(/[0-9]/)]),
      cardType:['',Validators.required],
      cardNumber:new FormControl('',[Validators.required,patternValidator(/[0-9\+\-\ ]/)]),
      firstName:['',Validators.required],
      lastName:['',Validators.required], 
      month:['',Validators.required], 
      year:['',Validators.required],
      cvv:['',Validators.required],
      communication:[''],
      terms:['']  
    }
  }
  giftBalance(){
    return{
      GivexCardNumber:new FormControl('',[Validators.required]),
      GivexPinNumber:new FormControl('',[Validators.required]),
      captcha:['',Validators.required]
    }
  }
  transferBalance(){
    return{
      depositor:new FormControl('',[Validators.required,patternValidator(/[0-9\+\-\ ]/)]),
      creditor:new FormControl('',[Validators.required,patternValidator(/[0-9\+\-\ ]/)])
    }
  }
  
}