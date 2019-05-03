import { Component, OnInit,ViewEncapsulation,ChangeDetectionStrategy,SecurityContext,HostListener,ElementRef,ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as _ from 'lodash';
declare var $: any;
declare var AmpCa :any
@Component({
  selector: 'app-pick-mix-travel',
  templateUrl: './pick-mix-travel.component.html',
  styleUrls: ['./pick-mix-travel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickMixTravelComponent implements OnInit {
  @ViewChild('scrollbarRef') scrollRef: ElementRef;
  current:boolean=true;
  safeUrl:  SafeResourceUrl;
  pickMix=false;
  pickMixProducts=[
    {
      data:'section-1',
      description:'Rem iste iure blanditiis excepturi esse nisi corrupti sequi, illo, laborum quo quis quaerat assumenda perspiciatis quod fuga vel laudantium doloribus architecto tempora omnis earum! Rem iste iure blanditiis excepturi esse nisi corrupti sequi, illo, laborum quo quis quaerat assumenda perspiciatis quod fuga vel laudantium doloribus architecto tempora omnis earum!'
    },
    {
      data:'section-2',
      description:'Rem iste iure blanditiis excepturi esse nisi corrupti sequi, illo, laborum quo quis quaerat assumenda perspiciatis quod fuga vel laudantium doloribus architecto tempora omnis earum! Rem iste iure blanditiis excepturi esse nisi corrupti sequi, illo, laborum quo quis quaerat assumenda perspiciatis quod fuga vel laudantium doloribus architecto tempora omnis earum!'
    },
    {
      data:'section-3',
      description:'Rem iste iure blanditiis excepturi esse nisi corrupti sequi, illo, laborum quo quis quaerat assumenda perspiciatis quod fuga vel laudantium doloribus architecto tempora omnis earum! Rem iste iure blanditiis excepturi esse nisi corrupti sequi, illo, laborum quo quis quaerat assumenda perspiciatis quod fuga vel laudantium doloribus architecto tempora omnis earum!'
    },
    {
      data:'section-4',
      description:'Rem iste iure blanditiis excepturi esse nisi corrupti sequi, illo, laborum quo quis quaerat assumenda perspiciatis quod fuga vel laudantium doloribus architecto tempora omnis earum! Rem iste iure blanditiis excepturi esse nisi corrupti sequi, illo, laborum quo quis quaerat assumenda perspiciatis quod fuga vel laudantium doloribus architecto tempora omnis earum!'
    },
    {
      data:'section-5',
      description:'Rem iste iure blanditiis excepturi esse nisi corrupti sequi, illo, laborum quo quis quaerat assumenda perspiciatis quod fuga vel laudantium doloribus architecto tempora omnis earum! Rem iste iure blanditiis excepturi esse nisi corrupti sequi, illo, laborum quo quis quaerat assumenda perspiciatis quod fuga vel laudantium doloribus architecto tempora omnis earum!'
    },
    {
      data:'section-6',
      description:'Rem iste iure blanditiis excepturi esse nisi corrupti sequi, illo, laborum quo quis quaerat assumenda perspiciatis quod fuga vel laudantium doloribus architecto tempora omnis earum! Rem iste iure blanditiis excepturi esse nisi corrupti sequi, illo, laborum quo quis quaerat assumenda perspiciatis quod fuga vel laudantium doloribus architecto tempora omnis earum!'
    }
  ]
  @HostListener("window:scroll", ['$event'])
  windowScroll(event) {
    var scrollDistance = $(window).scrollTop();

 $('.page-section').each(function(i) {
  if ($(this).position().top <= scrollDistance) {
    console.log(scrollDistance,$(this).position().top)
      $('.navigation a.active').removeClass('active');
      $('.navigation a').eq(i).addClass('active');
  }
});

  
  };
  constructor() { }

  ngOnInit() {
  }
  scrollToUsageSection(event){
    event.preventDefault();

    const target =event.target.getAttribute('href');
    console.log($(target).offset().top);
    $('html, body').stop().animate({
      scrollTop: $(target).offset().top
  }, 600, function() {
    
      location.hash = target; //attach the hash (#jumptarget) to the pageurl
  });

  // return false;

    // this.scrollRef.nativeElement.scrollToTop(target);
  }
}
