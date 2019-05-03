import { Component, OnInit,OnDestroy,ViewChild, ViewEncapsulation,ElementRef, AfterViewInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import {SingletonService} from '../../services/singleton.service';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
@Input()data:any;
  constructor(private el: ElementRef,public location: Location,public router: Router,public route :ActivatedRoute,
    public singletonServ: SingletonService,private titleService: Title) { }

  ngOnInit() {
  }
  onShowDetailPage(event,data){
    let url ='/store'+data.url.replace('/p/','/');
    this.router.navigate([url]);
  }

}
