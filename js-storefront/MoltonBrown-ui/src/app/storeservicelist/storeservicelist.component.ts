import { Component, OnInit } from '@angular/core';
import {StorefinderService} from '../storefinder/storefinder.service';
@Component({
  selector: 'app-storeservicelist',
  templateUrl: './storeservicelist.component.html',
  styleUrls: ['./storeservicelist.component.scss']
})
export class StoreservicelistComponent implements OnInit {

  constructor(public storeServ:StorefinderService) { }

  ngOnInit() {
    
  }

}
