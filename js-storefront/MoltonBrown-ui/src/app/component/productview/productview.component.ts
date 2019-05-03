import {
  Component,
  ViewEncapsulation,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChange
} from "@angular/core";
import { productviewComponentService } from "./productview.service";
import { SingletonService } from "../../services/singleton.service";
import * as _ from "lodash";
import { Location } from "@angular/common";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
@Component({
  selector: "app-productview",
  templateUrl: "./productview.component.html",
  styleUrls: ["./productview.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ProductviewComponent implements OnInit, OnChanges {
  @Input() showDetail: boolean;
  @Input() productInfo: any;

  @Output() showProductDetail: EventEmitter<any> = new EventEmitter<any>();
  @Output() onQuickView: EventEmitter<any> = new EventEmitter<any>();
  relevantProducts: any;
  showFragrance: boolean;
  showExplore: boolean;
  showBenifits: boolean;
  showDelivery: boolean;
  currentCnt: string;
  prodQuantity: string;
  pdpImage: string;
  pdpSlides: Array<any>;
  slideConfig: any;
  regUser: any;
  favourite: boolean = true;
  constructor(
    public quickServ: productviewComponentService,
    public singletonServ: SingletonService,
    public location: Location,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.showFragrance = true;
    this.showBenifits = false;
    this.showExplore = false;
    this.showDelivery = false;
    this.prodQuantity = "1";
    this.slideConfig = { slidesToShow: 1, slidesToScroll: 2 };
  }

  ngOnInit() {}
  onClickFavourite() {
    this.router.navigate(["store", "myaccount", "profile", "myFavorites"]);
  }
  addToFavourite(event, data) {
    event.preventDefault();
    const that = this;
    const baseSiteid = this.singletonServ.catalogVersionId;
    const user = JSON.parse(sessionStorage.getItem("customerToken"));
    that.quickServ.generateCartToken().subscribe(
      token => {
        const tokenId = token["access_token"];
        that.quickServ
          .addToFavourite(baseSiteid, tokenId, user.email, data.code)
          .subscribe(
            resp => {
              that.favourite = false;
            },
            err => {}
          );
      },
      err => {}
    );
  }
  onShowProductDetails(data) {
    // this.showProductDetail.emit(data);
    let url = "/store" + data.url.replace("/p/", "/");

    this.router.navigate([url]);
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  pdpData(data) {}
  getImageUrl(data, bol) {
    if (bol) {
      return (
        "http://i1.adis.ws/s/moltonbrown/" +
        data.code +
        "_uk_set?$LargeImageTemplate1$"
      );
    } else {
      return data.src;
    }
  }
  checkFavourite(user, code) {
    const that = this;
    const _favourites = this.singletonServ.favourites;
    const baseSiteid = this.singletonServ.catalogVersionId;
    if (_favourites) {
      const _fav = _.find(_favourites, function(o) {
        return o.code == code;
      });
      if (_fav) {
        that.favourite = false;
      } else {
        that.favourite = true;
      }
    } else {
      that.quickServ.generateCartToken().subscribe(
        token => {
          const tokenId = token["access_token"];
          that.quickServ
            .getFavourites(baseSiteid, tokenId, user.email)
            .subscribe(
              response => {
                const _fav = _.find(response["products"], function(o) {
                  return o.code == code;
                });
                this.singletonServ.favourites = response["products"];
                if (_fav) {
                  that.favourite = false;
                } else {
                  that.favourite = true;
                }
              },
              error => {
                that.favourite = true;
              }
            );
        },
        err => {}
      );
    }
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const that = this;
    if (changes["productInfo"]) {
      if (changes["productInfo"]["currentValue"] != undefined) {
        const _code = changes["productInfo"]["currentValue"]["code"];
        this.pdpImage = "http://i1.adis.ws/s/moltonbrown/" + _code + "_uk_set";
        if (sessionStorage.getItem("customerToken")) {
          const _user = JSON.parse(sessionStorage.getItem("customerToken"));
          that.regUser = true;
          that.favourite = true;
          if(changes["showDetail"])
          that.checkFavourite(_user, _code);
        } else {
          that.regUser = false;
        }
      }
    }
  }
  getrelevantProducts(code) {}
  onCollapseDetail(event, data) {
    event.stopPropagation();
    if (this.currentCnt != data) {
      if (data == "fragrance") {
        this.showFragrance = true;
        this.showBenifits = false;
        this.showExplore = false;
        this.showDelivery = false;
        this.currentCnt = data;
      } else if (data == "benefits") {
        this.showFragrance = false;
        this.showExplore = false;
        this.showDelivery = false;
        this.showBenifits = true;
        this.currentCnt = data;
      } else if (data == "delivery") {
        this.showFragrance = false;
        this.showExplore = false;
        this.showDelivery = true;
        this.showBenifits = false;
        this.currentCnt = data;
      } else {
        this.showFragrance = false;
        this.showExplore = true;
        this.showBenifits = false;
        this.showDelivery = false;
        this.currentCnt = data;
      }
    } else {
      this.showFragrance = false;
      this.showExplore = false;
      this.showBenifits = false;
      this.showDelivery = false;
    }
  }

  addToBasket(item) {
    const that = this;
    const baseSiteid = this.singletonServ.catalogVersionId;
    this.quickServ.generateCartToken().subscribe(
      resp => {
        const tokenId = resp["access_token"];
        if (sessionStorage.getItem("customerToken")) {
          const data = JSON.parse(sessionStorage.getItem("customerToken"));
          this.singletonServ.loggedIn = true;
          const logged = true;
          if (!data.code) {
            that.createCart(item, baseSiteid, tokenId, logged);
          } else {
            this.storeCurrentUserBasket(
              baseSiteid,
              item,
              tokenId,
              data.code,
              data.email
            );
          }
        } else {
          const logged = false;
          if (!sessionStorage.getItem("cartGUID")) {
            that.createCart(item, baseSiteid, tokenId, logged);
          } else {
            const data = JSON.parse(sessionStorage.getItem("cartGUID"));
            const cartId = "/" + data["guid"];
            that.addprdToCart(item, baseSiteid, cartId, tokenId);
          }
        }
      },
      error => {}
    );
  }
  createCart(item, baseSiteid, tokenId, logged) {
    const that = this;
    this.quickServ.generateCartId(baseSiteid, tokenId).subscribe(
      data => {
        const cartId = "/" + data["guid"];
        if (logged) {
          this.addProductToCurrentBasket(item, baseSiteid, tokenId);
        } else {
          const _obj = {
            guid: data["guid"],
            tokenId: tokenId
          };
          sessionStorage.setItem("cartGUID", JSON.stringify(_obj));
          that.addprdToCart(item, baseSiteid, cartId, tokenId);
        }
      },
      error => {}
    );
  }
  addProductToCurrentBasket(item, baseSiteid, tokenId) {
    const data = JSON.parse(sessionStorage.getItem("customerToken"));
    const _email = data.email;
    this.quickServ.createRegisterCart(baseSiteid, tokenId, _email).subscribe(
      resp => {
        data["code"] = resp["code"];
        data["token"] = tokenId;
        sessionStorage.setItem("customerToken", JSON.stringify(data));
        this.storeCurrentUserBasket(
          baseSiteid,
          item,
          tokenId,
          resp["code"],
          _email
        );
      },
      err => {}
    );
  }
  storeCurrentUserBasket(baseSiteid, item, tokenId, code, _email) {
    const user = JSON.parse(sessionStorage.getItem("customerToken"));
    const that = this;
    const productObj = {
      product: { code: item["code"] },
      quantity: parseInt(this.prodQuantity)
    };
    this.quickServ
      .storeCurrentUserProducts(baseSiteid, productObj, tokenId, user.code, _email)
      .subscribe(
        resp => {
          item["count"] = parseInt(this.prodQuantity);
          const obj = { updateCart: true,code: item["code"], showCartPopUp: true };
          this.singletonServ.sendMessage(obj);
          that.onQuickView.emit(item);
          window.scrollTo(0, 0);
        },
        error => {}
      );
  }
  addprdToCart(item, baseSiteid, cartId, tokenId) {
    const that = this;
    const productObj = {
      product: { code: item["code"] },
      quantity: parseInt(this.prodQuantity)
    };
    this.quickServ
      .storeProductsToCart(baseSiteid, cartId, productObj, tokenId)
      .subscribe(
        cart => {
          item["count"] = parseInt(this.prodQuantity);
          const obj = { updateCart: true,code: item["code"], showCartPopUp: true };
          this.singletonServ.sendMessage(obj);
          that.onQuickView.emit(item);
          window.scrollTo(0, 0);
        },
        error => {}
      );
  }

  onThumbnailClick(event, pic) {
    event.preventDefault();
    this.pdpImage = pic.src;
  }
}
