import {Injectable} from '@angular/core';
import {FormControl, Validators } from '@angular/forms';
import { patternValidator,matchValidator } from './pattern-validator';

@Injectable({
  providedIn: 'root'
})
export class RegistrationForm {
  numberPattern:'^(0|[1-9][0-9]*)$';
  getForm() {
    return {
        uid: new FormControl('', [Validators.required, patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
        confirmemail: new FormControl('', [Validators.required, patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
        password:['',Validators.required],
        confirmPassword:['',Validators.required],
        titleCode:['',Validators.required],
        firstName:['',Validators.required],
        lastName:['',Validators.required],       
        country:['',Validators.required],
        postalCode: new FormControl('',[Validators.required]),
        address:[''],
        line1:['',Validators.required],
        line2:[''],
        town:[''],
        County:[''],
        phone: new FormControl('', [Validators.required,Validators.minLength(10),Validators.maxLength(13),patternValidator(/[0-9\+\-\ ]/)]), 
        age:[''],
        gender:[''],
    };
  }

  addressForm() {
    return {
        firstName:['',Validators.required],
        lastName:['',Validators.required], 
        phone: new FormControl('', [Validators.required,Validators.minLength(10),Validators.maxLength(13),patternValidator(/[0-9\+\-\ ]/)]), 
        country:[''],
        line1:['',Validators.required],
        line2:[''],
        city:[''],
        state:[''],
        address:[''],
        town:[''],
        County:[''],
        postalCode: new FormControl('',[Validators.required]),
    };
  }
  updatePassword(){
    return {
      password:['',Validators.required],
      newPassword:['',Validators.required],
      confirmPassword:['']
    }
  }
  profileForm(){
    return{
      titleCode:['',Validators.required],
      uid: new FormControl('', [Validators.required, patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      firstName:['',Validators.required],
      lastName:['',Validators.required],       
      country:['',Validators.required],
      postalCode: new FormControl('',[Validators.required]),
      address:[''],
      line1:['',Validators.required],
      line2:[''],
      town:[''],
      County:[''],
      phone: new FormControl('', [Validators.required,Validators.minLength(10),Validators.maxLength(13),patternValidator(/[0-9\+\-\ ]/)]), 
      age:[''],
      gender:['']
    }
  }
}