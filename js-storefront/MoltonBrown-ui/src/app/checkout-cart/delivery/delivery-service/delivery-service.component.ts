import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChange,
  AfterViewInit
} from "@angular/core";
import { DeliveryComponentService } from "../delivery.service";
import { SingletonService } from "../../../services/singleton.service";
@Component({
  selector: "app-delivery-service",
  templateUrl: "./delivery-service.component.html",
  styleUrls: ["./delivery-service.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class DeliveryServiceComponent implements OnInit, OnChanges ,AfterViewInit{
  @Output() onSecureChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onupdateCart: EventEmitter<any> = new EventEmitter<any>();
  @Input() deliveryInfo: any;
  @Input() expressWay: boolean;
  deliveryTypeselected: string = "";
  showBlock: boolean;
  serviceBody: boolean;
  shippingInfo: any;
  shippingServices: any;
  deliveryPayments: any;
  payTypeId: number;
  choosenDeliveryService: any;
  outstationDelivery: any;
  outstation: boolean;
  loading:boolean;
  namedDay:any;
  constructor(
    public delivryServ: DeliveryComponentService,
    public singletonServ: SingletonService
  ) {
    this.serviceBody = true;
    this.outstation = false;
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes["deliveryInfo"]) {
      if (changes["deliveryInfo"]["currentValue"] != undefined) {
        this.shippingInfo = changes["deliveryInfo"]["currentValue"];
      }
      // if (changes["expressWay"]["currentValue"] != undefined) {
      //   this.serviceBody = false;
      //   this.shippingInfo["payType"] = this.deliveryPayments[0];
      //   const obj = {
      //     payment: true
      //   };
      //   this.onSecureChanged.emit(obj);
      // }
    }
  }
  ngOnInit() {
    const country_code = this.deliveryInfo.customerAddress.country.isocode;
    if (country_code == "GB") {
      this.outstation = false;
      this.getDeliveryMethod();
    } else {
      this.outstation = true;
      this.getInternationalDeliveryMethod(country_code);
    }
  }
  ngAfterViewInit(){

  }
  getInternationalDeliveryMethod(country_code) {
    const that = this;
    const cVrsnid = this.singletonServ.catalogVersionId;
   
      that.delivryServ.generateCartToken().subscribe(token => {
        let tokenId = token["access_token"];
        if (sessionStorage.getItem("customerToken")) {        
        const user = JSON.parse(sessionStorage.getItem("customerToken"));
        that.delivryServ
          .getInternationalDelivery(
            cVrsnid,
            tokenId,
            user.email,
            user.code,
            country_code
          )
          .subscribe(
            response => {
              that.outstationDelivery =
                response["internationalShippingServices"];
            },
            err => {}
          );

        }else{
          if (sessionStorage.getItem("cartGUID")) {
            const _guest = JSON.parse(sessionStorage.getItem("cartGUID"));
            that.getGuestInternationalMethods(cVrsnid,tokenId,_guest['guid'],country_code)
          }
        }
      });
   
  }
  getGuestInternationalMethods(baseSiteId,token,cartCode,country_code){
   this.delivryServ.getGuestInternationalDelivery(baseSiteId,token,cartCode,country_code).subscribe((response)=>{
    this.outstationDelivery = response["internationalShippingServices"];
   },(error)=>{

   })
  }
  getDeliveryMethod() {
    const that = this;
    const cVrsnid = this.singletonServ.catalogVersionId;

    that.delivryServ.generateCartToken().subscribe(
      token => {
        const tokenId = token["access_token"];
        if (sessionStorage.getItem("customerToken")) {
          const user = JSON.parse(sessionStorage.getItem("customerToken"));
          that.delivryServ
            .getDeliveryMethod(cVrsnid, tokenId, user.email, user.code)
            .subscribe(
              resp => {
                this.deliveryPayments = resp["deliveryModes"];
              },
              err => {}
            );
        } else {
          if (sessionStorage.getItem("cartGUID")) {
            const _guest = JSON.parse(sessionStorage.getItem("cartGUID"));
            that.delivryServ
              .getGuestDeliveryMethod(cVrsnid, tokenId, _guest["guid"])
              .subscribe(
                response => {
                  this.deliveryPayments = response["deliveryModes"];
                },
                err => {}
              );
          }
        }
      },
      err => {}
    );
  }

  outstationDt(event) {
    const that=this;
    event.stopPropagation();
    this.deliveryTypeselected = "International Delivery";
    const cVrsnid = this.singletonServ.catalogVersionId;
    const _obj = this.outstationDelivery[0];
    
    const countryCode = this.shippingInfo.customerAddress.country.isocode;
    const _body = {
      deliveryCharge: _obj["deliveryCharge"]
    };
    this.delivryServ.generateCartToken().subscribe(
      token => {
        const tokenId = token["access_token"];

        if (sessionStorage.getItem("customerToken")) {
          const user = JSON.parse(sessionStorage.getItem("customerToken"));
          this.delivryServ
            .setInternationalDeliveryToCart(
              cVrsnid,
              tokenId,
              user.email,
              user.code,
              countryCode
            )
            .subscribe(
              resp => {
                this.serviceBody = false;
                const obj = {
                  international:true
                };
                this.onSecureChanged.emit(obj);


              },
              err => {}
            );
        }else{
          if (sessionStorage.getItem("cartGUID")) {
            const _guest = JSON.parse(sessionStorage.getItem("cartGUID"));
            this.setGuesInternationalDeliveryToCart(cVrsnid, tokenId,_guest['guid'],countryCode);
          }

        }
      },
      err => {}
    );
  }

  setGuesInternationalDeliveryToCart(cVrsnid, tokenId,cartCode,countryCode){
   const that=this;
   this.delivryServ.setGuestInternationalDeliveryToCart(cVrsnid,tokenId,cartCode,countryCode).subscribe((response)=>{
  
     this.serviceBody = false;
    const obj = {
      international:true
    };
    this.onSecureChanged.emit(obj);
   },(error)=>{})
  }
  onDeleveryType(event, data, k) {
    event.stopPropagation();
    this.namedDay=undefined;
    const that = this;
    this.deliveryTypeselected = this.deliveryPayments[k].code;
    that.showBlock = true;

    this.deliveryPayments.map((obj, id) => {
      if (id == k) {
        obj["disabled"] = false;
        that.payTypeId = id;
      } else {
        obj["disabled"] = false;
      }
    });
    const _obj = this.deliveryPayments[k];
    const _body = {
      deliveryCode: data.code
    };
    const cVrsnid = this.singletonServ.catalogVersionId;

    this.delivryServ.generateCartToken().subscribe(token => {
      const tokenId = token["access_token"];

      if (sessionStorage.getItem("customerToken")) {
        const user = JSON.parse(sessionStorage.getItem("customerToken"));

        if (this.deliveryTypeselected == "UK-Standard-Delivery") {
          that.delivryServ
            .deliverymethodToCart(
              cVrsnid,
              tokenId,
              _body,
              _obj,
              user.email,
              user.code
            )
            .subscribe(
              resp => {
                const _obj = {
                  updatFullCart: true
                };
                that.singletonServ.sendMessage(_obj);
              },
              err => {}
            );
        } else {
          that.delivryServ
            .deliveryNamedDayToCart(cVrsnid, tokenId, user.email, user.code)
            .subscribe(
              resp => {
                that.shippingServices = resp["namedShippingServices"];
              },
              err => {}
            );
        }
      } else {
        if (sessionStorage.getItem("cartGUID")) {
          const _guest = JSON.parse(sessionStorage.getItem("cartGUID"));
          this.setAnonymousDeliverTocart(cVrsnid, tokenId,_body,_obj,_guest);
        }
      }
    });
  }
  setAnonymousDeliverTocart(baseSite,token,_body,_obj,user){
    const that=this;
    if (this.deliveryTypeselected == "UK-Standard-Delivery") {
       that.delivryServ.guestDeliverymethodToCart(baseSite,token,_body,_obj,user['guid']).subscribe((response)=>{
        const _obj = {
          updatFullCart: true
        };
        that.singletonServ.sendMessage(_obj);
       },(error)=>{

       });
     
    }else{
      that.delivryServ.getGuestNamedDayList(baseSite,token,user['guid']).subscribe((response)=>{
        that.shippingServices = response["namedShippingServices"];
      },(error)=>{

      });
    }
  }
  onSecureCheck() {
    const that = this;
    this.serviceBody = false;
    this.shippingInfo["payType"] = this.deliveryPayments[this.payTypeId];
    const obj = {
      payment: true,
      deliverytype: this.deliveryPayments[that.payTypeId]
    };
    this.onSecureChanged.emit(obj);
  }
  onEditDeliveryType(bol, type) {
    const that = this;
    if (bol) {
      const Obj = {
        payment: false,
        service: false,
        type: type,
        formUpdate: type == "profile" ? true : false,
        showDtService: type == "delivery" ? true : false,
        formData: that.deliveryInfo
      };
      this.onSecureChanged.emit(Obj);
    } else {
      const Obj = {
        payment: false,
        service: true,
        type: type
      };
      this.onSecureChanged.emit(Obj);
      this.serviceBody = true;
      this.shippingInfo["payType"] = undefined;
    }
  }
  onSelectNameDay(data,id) {
    const that = this;
    const cVrsnid = this.singletonServ.catalogVersionId;
  
    this.shippingServices.map((obj,k)=>{
       if(id==k){
        obj.active=true;
        this.namedDay=data;
       }else{
        obj.active=false;
       }
    })
    const _body = {
      deliveryCode: data.id
    };
    this.delivryServ.generateCartToken().subscribe(
      token => {
        const tokenId = token["access_token"];
        if (sessionStorage.getItem("customerToken")) {
          const user = JSON.parse(sessionStorage.getItem("customerToken"));
          this.loading=true;
          that.delivryServ
            .setNamedDeliveryModeToCart(
              cVrsnid,
              tokenId,
              user.email,
              user.code,
              _body
            )
            .subscribe(
              resp => {
                that.onupdateCart.emit();
                this.loading=false;
              },
              err => {  this.loading=false;}
            );
        }else{
          if (sessionStorage.getItem("cartGUID")) {
            const _guest = JSON.parse(sessionStorage.getItem("cartGUID"));
            that.setNamedDayServicetoCart(cVrsnid,tokenId,_guest,_body);
          }
        }
      },
      err => {}
    );
  }

  setNamedDayServicetoCart(cVrsnid,token,guest,data){
   const that=this;
   this.loading=true;
   this.delivryServ.setGuestNamedDeliveryModeToCart(cVrsnid,token,guest['guid'],data).subscribe((response)=>{
    that.onupdateCart.emit();
    that.loading=false;
   },(error)=>{
    that.loading=false;
   });
  }
}
