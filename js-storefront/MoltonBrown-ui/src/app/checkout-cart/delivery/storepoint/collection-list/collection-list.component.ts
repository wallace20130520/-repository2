import { Component, OnInit,Input , OnChanges, SimpleChange, Output,EventEmitter} from '@angular/core';
import {SingletonService} from '../../../../services/singleton.service';
@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss']
})
export class CollectionListComponent implements OnInit,OnChanges {
  @Input() storeList:any;
  @Output() emitselectedStore: EventEmitter<any> = new EventEmitter<any>();
  stores:Array<any>=[];
  constructor(public singletonServ:SingletonService) { }

  ngOnInit() {
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange })  {
    const that=this;    
    if (changes['storeList']){
      if (changes['storeList']['currentValue'] != undefined){
      }
    }
  }
  onSelectStore(event,data){
    event.preventDefault();
    const _obj={
      selectedStore:data
    }
    this.emitselectedStore.emit(_obj);
  }
}
