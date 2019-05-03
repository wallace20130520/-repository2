import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})



export class ValidationService {

  constructor() { }

  //Check Site contains SSL Security protocol  or Not.
  static secureSiteValidator(control){
    if (!control.value.startsWith('https') || !control.value.includes('.in')) {
      return { IsSecureSite: true };
    }

    return null;
  }

  //Email Validator
  static emailValidator(control) {
      if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
          return null;
      }
      else {
          return { 'InvalidEmail': true };
      }
  }

  //Password Validator
  static passwordValidator(control) {
      if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
          return null;
      }
      else {
          return { 'InvalidPassword': true };
      }
  }
}