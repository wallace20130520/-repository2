import { Component, OnInit,ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-newsletter-signup',
  templateUrl: './newsletter-signup.component.html',
  styleUrls: ['./newsletter-signup.component.scss'],  
  encapsulation: ViewEncapsulation.None
})
export class NewsletterSignupComponent implements OnInit {
  breadcrumb:Array<any>;
  days:Array<any>;
  months:Array<any>;
  years:Array<any>;
  constructor() {
    this.breadcrumb=['NEWSLETTER SIGN UP'];
   const days=[]
    for(let i=1;i<=31;i++){
      let count='';
      if(i>=10){
        const obj ={day:''+i}
        days.push(obj);
      }else{
        const obj ={day:'0'+i}
        days.push(obj); 
      }

    }
    this.days=days;
    const monthBox=[];
    const yearBox=[];
    for(let i=1;i<=12;i++){
      let count='';
      if(i>=10){
        const obj ={month:''+i}
        monthBox.push(obj);
      }else{
        const obj ={month:'0'+i}
        monthBox.push(obj); 
      }

    }

    this.months=monthBox;
    const date=new Date();
   const birthYear=date.getFullYear()-14;
    for(let k=1;k<=65;k++){
        const obj ={year:birthYear-1}
        yearBox.push(obj); 
    }
    this.years=yearBox;
   }

  ngOnInit() {
  }

}
