import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';
import { Event as NavigationEvent } from "@angular/router";
import { filter } from "rxjs/operators";
import { NavigationStart } from "@angular/router";
@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.scss']
})
export class MyaccountComponent implements OnInit {

  constructor(public router: Router,public route :ActivatedRoute) {


    
const that =this;

router.events
           .pipe(
               // The "events" stream contains all the navigation events. For this demo,
               // though, we only care about the NavigationStart event as it contains
               // information about what initiated the navigation sequence.
               filter(
                   ( event: NavigationEvent ) => {

                       return( event instanceof NavigationStart );

                   }
               )
           )
           .subscribe(
               ( event: NavigationStart ) => {
                   if(event.url == '/myacc/mbLogin'){
                     if(sessionStorage.getItem('customerToken')){
                     that.router.navigate(['store']);
                   }
                 }
                   if ( event.restoredState ) {
                       console.warn(
                           "restoring navigation id:",
                           event.restoredState.navigationId
                       );

                   } 
               }
           )




   }

  ngOnInit() {
  }

}
