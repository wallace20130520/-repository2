import {Injectable} from '@angular/core';
import {FormControl, Validators } from '@angular/forms';
import { patternValidator } from './pattern-validator';

@Injectable({
  providedIn: 'root'
})
export class ShipmentForm {
  numberPattern:'^(0|[1-9][0-9]*)$';
  getForm() {
    return {
        titleCode:['',Validators.required],
        firstName:['',Validators.required],
        lastName:['',Validators.required], 
        phone: new FormControl('', [Validators.required,Validators.minLength(10),Validators.maxLength(13),patternValidator(/[0-9\+\-\ ]/)]), 
        country:[''],
        line1:['',Validators.required],
        line2:[''],
        city:['',Validators.required],
        state:[''],
        address:[''],
        County:[''],
        postalCode: new FormControl('',[Validators.required]),
    };
  }
  addressData(){
    return{
      address:['',Validators.required]
    }
  }
}