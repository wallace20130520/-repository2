import { Component, OnInit, AfterViewInit,Input,OnChanges, SimpleChange } from '@angular/core';
import {SingletonService} from '../../services/singleton.service';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit,OnChanges {
@Input() breadcrumb:Array<any>;
listData:any;
  constructor(public singletonServ:SingletonService,public titleService:Title,public location: Location,public router: Router,public route :ActivatedRoute) { }

  ngOnInit() {
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange })  {
    
    
    if (changes['breadcrumb']){
      if (changes['breadcrumb']['currentValue'] != undefined){
       this.listData=changes['breadcrumb']['currentValue'];
      }
    }
  }
  onbreadcrumbClick(data){
  if(data.categoryDisplayName){
    let url ='/store'+data.url.replace('/c/','/').toLowerCase();
    this.titleService.setTitle(data.titleName);
    this.router.navigate([url]);
  }
  }
}