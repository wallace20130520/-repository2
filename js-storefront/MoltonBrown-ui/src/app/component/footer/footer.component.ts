import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { moltonBrownPolicies } from '../../staticpage.constant';
import {Router} from '@angular/router';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],  
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent implements OnInit {
  mbPoliciesData: Array<any>;
  mbfooterData: Array<any>;
  toggleFooter: boolean;
  constructor(public router: Router) {
    this.toggleFooter = true;
    this.mbPoliciesData = moltonBrownPolicies;
  }
  onFooterCntntClick(data){
    if(data.org){
      if(data.childroute){
        const route=data.templateName;
        const childRouteName=data.childRouteName;

        this.router.navigate(['store',route,childRouteName]);
      }else{
        this.router.navigate(['store',data.templateName]);
      }

    }else{
      if(data.routename){
      this.router.navigate(['store',data.routename]);
    }
    }
   this.onCancelToggleFooter();
}
  ngOnInit() {
  }
  onfooterToggle(data, k) {
    if(data.data){
    this.mbfooterData = data.data;
    this.mbPoliciesData.map((obj,id)=>{
      if(id==k){
        obj.active = true;
      }else{
        obj.active =false;
      }
    }); 
    this.toggleFooter = false;
  }else{
     this.mbPoliciesData.map((obj,id)=>{
       obj.active = false;     
     });
    this.toggleFooter = true;

    this.router.navigate(['store',data.templateName]);
  }
}
  onCancelToggleFooter() {
    this.mbPoliciesData.map((obj,id)=>{
        obj.active = false;     
    });
    this.toggleFooter = true;
  }
}
