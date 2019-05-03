import {
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
  Renderer,
  HostListener
} from "@angular/core";
import { HeaderComponentService } from "./header.service";
import { SingletonService } from "../../services/singleton.service";
import { BasketPageComponentService } from "../../checkoutpage/basketpage/basketpage.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import * as _ from "lodash";

declare var $: any;
declare var AmpCa: any;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild("scrollContainer") scrollCartContainer: ElementRef;
  countryText: string;
  menuData: any;
  toggle: boolean;
  subscription: Subscription;
  templates: Array<any>;
  cart: any;
  totalAmount: number;
  cartStatus: boolean;
  deliverySlotId: "ab323146-8e01-4611-8f55-c162e4f07d8b";
  deliveryText: string;
  loggedIn: boolean;
  showCartBlock: boolean;
  constructor(
    public headerServ: HeaderComponentService,
    public singletonServ: SingletonService,
    public location: Location,
    public router: Router,
    public basketServ: BasketPageComponentService
  ) {
    this.toggle = false;
    this.deliveryText = "Free UK Standard Delivery when you spend £49.*";
    this.loggedIn = false;
  }
  onSignOut() {
    sessionStorage.removeItem("customerToken");
    sessionStorage.removeItem("cartGUID");
    sessionStorage.clear();
    sessionStorage.removeItem("cartGUID");
    localStorage.removeItem("order");
    localStorage.clear();
    this.router.navigate(["store", "myacc"]);
  }
  /*rendering Amplience Content Using Ampca variable IIFE Function located in assets/js*/
  getTopHeadCntnt() {
    AmpCa.utils = new AmpCa.Utils();
    AmpCa.utils.getHtmlServiceData({
      auth: {
        baseUrl: "https://c1.adis.ws",
        id: "ab323146-8e01-4611-8f55-c162e4f07d8b",
        store: "moltonbrown",
        templateName: "acc-template-text",
        locale: "en-GB"
      },
      callback: function(data) {
        document.querySelectorAll(".header-top-amptext")[0].innerHTML = data;
      }
    });
  }

  ngOnInit() {
    const that = this;
    this.showCartBlock = false;
    this.countryText = this.singletonServ.catalogVersionId;
    this.getTopHeadCntnt();
    if (sessionStorage.getItem("customerToken")) {
      const data = JSON.parse(sessionStorage.getItem("customerToken"));
      this.loggedIn = true;
      this.singletonServ.loggedIn = true;
      if (data.code) {
        const message = undefined;
        this.fetchcurrentuserBasket(data, message);
      } else {
        this.headerServ.generateCartToken().subscribe(
          resp => {
            data["token"] = resp["access_token"];
            that.fetchRelavantBasket(data);
          },
          err => {}
        );
      }
    } else {
      const baseSiteid = "moltonbrown-uk";
      if (sessionStorage.getItem("cartGUID")) {
        const data = JSON.parse(sessionStorage.getItem("cartGUID"));
        const cartId = "/" + data["guid"];
        const message = undefined;
        this.fetchBasket(baseSiteid, cartId, message);
      } else {
      }
    }
  }

  fetchcurrentuserBasket(data, message) {
    const baseSiteid = "moltonbrown-uk";
    this.headerServ
      .getCurrentUserCartDetail(baseSiteid, data.token, data.email, data.code)
      .subscribe(
        resp => {
          this.cart = resp;
          this.singletonServ.cartObj = this.cart;
          this.cartStatus = resp["totalItems"] != 0 ? true : false;
          if (this.cartStatus) {
            let count = {
              cartCount: true,
              response: resp
            };
            this.singletonServ.sendMessage(count);
            if (message) {
              if (message.showCartPopUp) {
                this.showCartBlock = true;
                window.scrollTo(0, 0);
                setTimeout(() => {
                  this.showCartBlock = false;
                }, 2000);
              }
            }
          }
        },
        err => {}
      );
  }

  fetchBasket(baseSiteid, cartId, message) {
    this.headerServ.getMBCartDetail(baseSiteid, cartId).subscribe(
      resp => {
        this.cart = resp;
        if (sessionStorage.getItem("cartGUID")) {
          const data = JSON.parse(sessionStorage.getItem("cartGUID"));
          data["code"] = resp["code"];
          sessionStorage.setItem("cartGUID", JSON.stringify(data));
        }
        this.cartStatus = resp["totalItems"] != 0 ? true : false;
        this.singletonServ.cartObj = resp;
        if (message) {
          if (message.showCartPopUp) {
            this.showCartBlock = true;
            const _id='#'+message.code;
          //   let el = this.scrollCartContainer.nativeElement.querySelector(_id);
          //  el.scrollIntoView();
            setTimeout(() => {
              this.showCartBlock = false;
            }, 2000);
          }
        }
        if (this.cartStatus) {
          let count = {
            cartCount: true,
            response: resp
          };
          this.singletonServ.sendMessage(count);
        }
      },
      error => {}
    );
  }
  onViewBasket() {
    this.router.navigate(["store", "mbcart"]);
  }
  ngAfterViewInit() {
    const that = this;
    const baseSiteid = "moltonbrown-uk";
    this.subscription = this.singletonServ.getMessage().subscribe(message => {
      if (message.updateCart) {
        if (sessionStorage.getItem("customerToken")) {
          let data = JSON.parse(sessionStorage.getItem("customerToken"));
          this.loggedIn = true;
          this.singletonServ.loggedIn = true;
          if (data.code) {
            this.fetchcurrentuserBasket(data, message);
          } else {
            this.headerServ.generateCartToken().subscribe(
              resp => {
                data["token"] = resp["access_token"];
                that.fetchRelavantBasket(data);

                if (message.showCartPopUp) {
                  this.showCartBlock = true;
                  window.scrollTo(0, 0);
                  setTimeout(() => {
                    this.showCartBlock = false;
                  }, 2000);
                }
              },
              err => {}
            );
          }
        } else {
          if (sessionStorage.getItem("cartGUID")) {
            const data = JSON.parse(sessionStorage.getItem("cartGUID"));
            const cartId = "/" + data["guid"];
            this.fetchBasket(baseSiteid, cartId, message);
          }
        }
      } else if (message.access_token) {
        this.loggedIn = true;
        this.singletonServ.loggedIn = true;
      }
    });
  }
  fetchRelavantBasket(data) {
    const baseSiteid = "moltonbrown-uk";
    this.headerServ
      .getCurrentUserRelevantCart(baseSiteid, data.token, data.email)
      .subscribe(
        resp => {
          if (resp["carts"]) {
            const code = resp["carts"][0]["code"];
            data["code"] = code;
            sessionStorage.setItem("customerToken", JSON.stringify(data));
            const message = undefined;
            this.fetchcurrentuserBasket(data, message);
          }
        },
        error => {}
      );
  }

  onNewsletterClick() {
    this.router.navigate(["store", "newsletter-sign-up"]);
  }
  onSidemenutap() {
    this.toggle = !this.toggle;
    const toggle = {
      toggle: {
        state: this.toggle
      }
    };
    this.singletonServ.sendMessage(toggle);
  }

  onProfileClick() {
    if (sessionStorage.getItem("customerToken")) {
      this.router.navigate(["store", "myaccount", "profile"]);
    } else {
      this.router.navigate(["store", "myacc"]);
    }
  }
  getCartCount() {
    let sum = 0;
    this.totalAmount = 0;
    const that = this;
    if (this.cart) {
      if (this.cart.totalItems != 0) {
        for (let i = 0; i < that.cart["entries"].length; i++) {
          if (!that.cart["entries"][i]["product"]["isSample"]) {
            sum += that.cart["entries"][i]["quantity"];
          }
        }
      }
    }
    return sum;
  }
  // getTotalAmount(){
  //   const that=this;
  //   let sum=0;
  //   for (let i = 0; i < that.cart['entries'].length; i++) {
  //     sum += that.cart['entries'][i]['quantity']*that.cart['entries'][i]['totalPrice']['value'];
  //  }
  //  this.singletonServ.totalAmount=sum;
  //   return this.singletonServ.totalAmount;
  // }
  getTotalAmount() {
    let sum = 0;
    if (this.cart) {
      sum = this.cart.totalPriceWithTax.formattedValue;
    }
    return sum;
  }
  getTotalProductAmount() {
    let sum = 0;
    for (let i = 0; i < this.cart.entries.length; i++) {
      sum +=
        this.cart.entries[i]["price"]["value"] * this.cart.entries[i]["count"];
    }
    this.singletonServ.totalAmount = sum;
    return this.singletonServ.totalAmount;
  }
  onSpliceItem(event, data, k) {
    event.stopPropagation();
    const that = this;
    const baseSiteid = this.singletonServ.catalogVersionId;
    if (sessionStorage.getItem("customerToken")) {
      let user = JSON.parse(sessionStorage.getItem("customerToken"));
      that.basketServ
        .removeEntry(
          baseSiteid,
          user["token"],
          user["code"],
          user["email"],
          data["entryNumber"]
        )
        .subscribe(
          resp => {
            const obj = {
              refreshBasket: true
            };
            this.singletonServ.sendMessage(obj);
            that.fetchRelavantBasket(user);
          },
          err => {}
        );
    } else {
      if (sessionStorage.getItem("cartGUID")) {
        const guidData = JSON.parse(sessionStorage.getItem("cartGUID"));
        const cartId = "/" + guidData["guid"];
        const entrynumber = "/" + data["entryNumber"];
        that.basketServ.generateCartToken().subscribe(
          res => {
            const tokenId = res["access_token"];
            that.basketCount(baseSiteid, cartId, entrynumber, tokenId);
          },
          error => {}
        );
      }
    }
  }
  basketCount(baseSiteid, cartId, entrynumber, tokenId) {
    const that = this;
    that.basketServ
      .removePrdct(baseSiteid, cartId, entrynumber, tokenId)
      .subscribe(
        res => {
          const obj = {
            refreshBasket: true
          };
          this.singletonServ.sendMessage(obj);
          const message = undefined;
          this.fetchBasket(baseSiteid, cartId, message);
        },
        error => {}
      );
  }

  onShowProduct(event, searchItem) {
    event.stopPropagation();
    let url = "/store" + searchItem.product.url.replace("/p/", "/");
    this.router.navigate([url]);
  }
  onCountryChange(country) {
    if (country == "us") {
      this.countryText = "moltonbrown-us";
    } else if (country == "uk") {
      this.countryText = "moltonbrown-uk";
    } else if (country == "ge") {
      this.countryText = "moltonbrown-ge";
    } else if (country == "au") {
      this.countryText = "moltonbrown-au";
    } else if (country == "eu") {
      this.countryText = "moltonbrown-eu";
    }
  }
  onCancelModal(bol) {
    if (bol) {
      const obj = {
        siteid: "moltonbrown-uk"
      };
      this.singletonServ.sendMessage(obj);
      this.singletonServ.catalogVersionId = this.countryText;
      this.router.navigate(["store"]);
    }
  }
  onHoverCartIcon() {}
  onleaveCart() {}
  onHoverProfileIcon() {
    if (sessionStorage.getItem("customerToken")) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }
}
