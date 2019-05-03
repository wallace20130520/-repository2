import { Component, OnInit,EventEmitter,ViewEncapsulation,Input,Output,ViewChild,ElementRef,NgZone } from '@angular/core';
import {StorePointComponentService} from './storepoint.service';
import * as _ from 'lodash';
import {SingletonService} from '../../../services/singleton.service';

import { MapsAPILoader } from '@agm/core';
@Component({
  selector: 'app-storepoint',
  templateUrl: './storepoint.component.html',
  styleUrls: ['./storepoint.component.scss'],  
  encapsulation: ViewEncapsulation.None
})
export class StorepointComponent implements OnInit {
  listView:boolean;
  mbPointOfServices:any;
  pointOfServices:any;
  storesList:Array<any>=[];
  pointService:boolean;
  mbpointService:boolean;
  showStores:boolean;
  postCode:string;
  loader:boolean;
  @Output() selectedStore: EventEmitter<any> = new EventEmitter<any>();
  searchTerm:string;
  @ViewChild("search")   searchElementRef: ElementRef;
  constructor(private zone: NgZone,public singletonServ:SingletonService,public storeServ:StorePointComponentService,
    private mapsAPILoader: MapsAPILoader,private ngZone: NgZone) {
    this.listView=true;
    this.showStores=false;
   }

  ngOnInit() {  

  }

  setAddress(addrObj) {
    const that=this;
    this.zone.run(() => {
     that.postCode=addrObj.postal_code;
    });
  }
  onSearchKeyUp(event){
    const term=event.target.value;
    console.log(term);
    this.searchTerm = term;
    if (this.searchTerm === '') return;
  }

  emitselectedStore(data){
    this.selectedStore.emit(data);
  }
  onPostCodeClick(){
    this.loader=true;
    this.showGfS();
  }
  showGfS(){
    const that=this;
    const baseSiteid =this.singletonServ.catalogVersionId;
    const postalCode =this.postCode;
    if( sessionStorage.getItem('customerToken')){
      const data = JSON.parse(sessionStorage.getItem('customerToken'));
      
      this.storeServ.getGFSData(baseSiteid,data.code,postalCode).subscribe((resp)=>{
        this.loader=false;
        let stores=resp['pointOfServices'];
        stores.map((obj)=>{
          obj['storeIcon']={
               url: require('../../../../assets/imgs/mb-cc.png')
          },
          obj['iconUrl']={
            url: require('../../../../assets/imgs/MBstore_pinicon.png'), 
            scaledSize: {
              height: 40,
              width: 40
            }
          }
        });
        console.log(stores);
       this.storesList=stores;
       this.pointService=true;               
       this.mbpointService=true;
       this.showStores=true;
      
      },(error)=>{
        this.loader=false;
      });
    }else{
      if(sessionStorage.getItem('cartGUID')){
       const data = JSON.parse(sessionStorage.getItem('cartGUID'));
       this.storeServ.getGFSData(baseSiteid,data.guid,postalCode).subscribe((resp)=>{
        this.loader=false;
        this.storesList=resp['pointOfServices'];
        this.pointService=true;               
        this.mbpointService=true;
        this.showStores=true;
       
       },(error)=>{
         this.loader=false;
        
      });
     }
    }
  }
  onShowStoreList(bol){
    this.listView=bol;
  }
  checkStores(event,store){
    event.stopPropagation();
    if(store == 'points'){
       if(event.target.checked){
         this.pointService=true;               
        if(this.mbpointService){
          let resultArr = [];
          resultArr= resultArr.concat(this.mbPointOfServices);          
          resultArr= resultArr.concat(this.pointOfServices);
          this.storesList=resultArr;
        }else{
          let resultArr = [];
          resultArr= resultArr.concat(this.mbPointOfServices);
          this.storesList=resultArr;
        }
       }else{
        this.pointService=false;
        let resultArr = [];
        resultArr= resultArr.concat(this.mbPointOfServices);
        this.storesList=resultArr;
       }
    }else{
      if(event.target.checked){    
        this.mbpointService=true;
        if(this.mbpointService){
          let resultArr = [];
          resultArr= resultArr.concat(this.mbPointOfServices);          
          resultArr= resultArr.concat(this.pointOfServices);
          this.storesList=resultArr;
        }else{
          let resultArr = [];
          resultArr= resultArr.concat(this.pointOfServices);
          this.storesList=resultArr;
        }
       }else{  
        let resultArr = [];
        this.mbpointService=false;
        resultArr= resultArr.concat(this.pointOfServices);
        this.storesList=resultArr;
       }
    }
  }
  
}
