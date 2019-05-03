import { Component, OnInit ,ViewEncapsulation} from '@angular/core';
declare var $BV;
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],  
  encapsulation: ViewEncapsulation.None
})
export class ReviewComponent implements OnInit {
  reviewBoxStatus:boolean;
  constructor() { 
    this.reviewBoxStatus=false;
  }

  ngOnInit() {
    $BV.ui( 'rr', 'show_reviews', {
      doShowContent : function () {
      }
   });
  }
  onReviewClick(){
    this.reviewBoxStatus = !this.reviewBoxStatus;
  }
}
