import { Component, OnInit,Input, ElementRef, NgZone, ViewChild, OnChanges,SimpleChange  } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
@Component({
  selector: 'app-store-locator',
  templateUrl: './store-locator.component.html',
  styleUrls: ['./store-locator.component.scss']
})
export class StoreLocatorComponent implements OnInit,OnChanges {
  public latitude: number;
  public longitude: number;
  public zoom: number;
  @Input() storePoints:any;
  stores:any;
  constructor(private mapsAPILoader: MapsAPILoader,private ngZone: NgZone) { }
  ngOnChanges(changes: { [propKey: string]: SimpleChange })  {
    const that =this;
    if (changes['storePoints']){
      if (changes['storePoints']['currentValue'] != undefined){
        console.log(changes['storePoints']['currentValue']);
        this.stores=changes['storePoints']['currentValue'];
      }
    }
  }
  ngOnInit() {
    this.zoom = 7;
    this.latitude = 55.3781;
    this.longitude = 3.4360;
     //set current position
     this.setCurrentPosition();

     //load Places Autocomplete
     this.mapsAPILoader.load().then(() => {
      //  let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
      //    types: ["address"]
      //  });
      //  autocomplete.addListener("place_changed", () => {
      //    this.ngZone.run(() => {
      //      //get the place result
      //      let place: google.maps.places.PlaceResult = autocomplete.getPlace();
 
      //      //verify result
      //      if (place.geometry === undefined || place.geometry === null) {
      //        return;
      //      }
 
      //      //set latitude, longitude and zoom
      //      this.latitude = place.geometry.location.lat();
      //      this.longitude = place.geometry.location.lng();
      //      this.zoom = 12;
      //    });
      //  });
     });
  }
  private setCurrentPosition() {
    // if ("geolocation" in navigator) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     console.log(position);
    //     this.latitude = position.coords.latitude;
    //     this.longitude = position.coords.longitude;
    //     this.zoom = 12;
    //   });
    // }
  }
}
