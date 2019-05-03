import { Component, OnInit,Input , OnChanges, SimpleChange, Output,EventEmitter,ViewEncapsulation} from '@angular/core';
import {SingletonService} from '../../../services/singleton.service';
@Component({
  selector: 'app-collect-service',
  templateUrl: './collect-service.component.html',
  styleUrls: ['./collect-service.component.scss'],  
  encapsulation: ViewEncapsulation.None
})
export class CollectServiceComponent implements OnInit,OnChanges {
  @Input() deliveryInfo:any;
  @Output() onCollectionChange: EventEmitter<any> = new EventEmitter<any>();
  storeData:any;
  mobile:string;
  payment:boolean;
  constructor(public singletonServ:SingletonService) {
    this.payment=false;
   }

  ngOnInit() {
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange })  {
    const that=this;    
    if (changes['deliveryInfo']){
      if (changes['deliveryInfo']['currentValue'] != undefined){
          that.storeData=changes['deliveryInfo']['currentValue'];
      }
    }
  }
  onUpdateCollect(){
    this.payment=true;
    this.storeData['mobile']=this.mobile;
    this.storeData['payment']=this.payment;
    this.onCollectionChange.emit(this.storeData);
  }
}
