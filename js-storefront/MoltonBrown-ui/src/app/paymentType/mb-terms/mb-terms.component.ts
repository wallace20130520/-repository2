import { Component, OnInit,Input , OnChanges, SimpleChange} from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
@Component({
  selector: 'app-mb-terms',
  templateUrl: './mb-terms.component.html',
  styleUrls: ['./mb-terms.component.scss']
})
export class MbTermsComponent implements OnInit {
  termsPolicy:boolean;
  termsMoltonbrown:boolean;
  @Input() formType:any;
termsForm:any
  constructor() { 
    this.termsPolicy=false;
    this.termsMoltonbrown=false;
  }

  ngOnInit() {
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange })  {
    
    
    if (changes['formType']){
      if (changes['formType']['currentValue'] != undefined){
        this.termsForm=changes['formType']['currentValue'];
      }
    }
  }
  onCheckTerms(event,status){
    if(event.target.checked){
   if(status){
    
       this.termsPolicy=true;
     }else{
      this.termsMoltonbrown=true;
     }
   }else{
    if(status){
    
      this.termsPolicy=false;
    }else{
     this.termsMoltonbrown=false;
    }
   }
  }
}
