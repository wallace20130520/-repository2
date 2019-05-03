import { Component, OnInit } from '@angular/core';
import {StorefinderService} from '../storefinder/storefinder.service';
@Component({
  selector: 'app-storefinder',
  templateUrl: './storefinder.component.html',
  styleUrls: ['./storefinder.component.scss']
})
export class StorefinderComponent implements OnInit {

  constructor(public storeServ:StorefinderService) { }

  ngOnInit() {
  }

}
