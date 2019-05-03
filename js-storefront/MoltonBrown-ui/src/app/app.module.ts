import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeviceDetectorModule } from 'ngx-device-detector';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';



import { HeaderComponent } from './component/header/header.component';
import { HeaderSubmenuComponent } from './component/header-submenu/header-submenu.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './component/footer/footer.component';
import {ProductSamplesComponent} from './checkoutpage/product-samples/product-samples.component';
//services
import {SlickModule} from 'ngx-slick';
import {productviewComponentService} from './component/productview/productview.service';
import {CategoryDetailComponentService} from './category-detail-page/category-detail-page.service';
import { AppService } from './app.service';
import { TooltipModule } from 'ng2-tooltip-directive';
import {HeaderComponentService} from './component/header/header.service';
import {HomeComponentService} from './home/home.service';
import {SingletonService} from './services/singleton.service';
import {PagerService} from './services/pager.service';
import {CategoryComponentService} from './categorylanding-page/categorylanding-page.service';

import { CategorylandingPageComponent } from './categorylanding-page/categorylanding-page.component';
import * as WebFont from 'webfontloader';
import { ProductviewComponent } from './component/productview/productview.component';
import { CategoryDetailPageComponent } from './category-detail-page/category-detail-page.component';
import { ReviewComponent } from './category-detail-page/review/review.component';
import { CheckoutpageComponent } from './checkoutpage/checkoutpage.component';
import { BasketpageComponent } from './checkoutpage/basketpage/basketpage.component';
import { BreadcrumbComponent } from './component/breadcrumb/breadcrumb.component';
import { CategorybannerComponent } from './categorylanding-page/categorybanner/categorybanner.component';
import {BasketPageComponentService} from './checkoutpage/basketpage/basketpage.service';
import { CheckoutRegitstrationComponent } from './checkout-cart/checkout-regitstration/checkout-regitstration.component';
import { CheckoutCartComponent } from './checkout-cart/checkout-cart.component';
import { ProductComponent } from './component/product/product.component';
import { EditorialComponent } from './features/editorial/editorial.component';
import { DeliveryComponent } from './checkout-cart/delivery/delivery.component';
import { StorepointComponent } from './checkout-cart/delivery/storepoint/storepoint.component';
import { DeliveryFormComponent } from './checkout-cart/delivery/delivery-form/delivery-form.component';
import { CollectionListComponent } from './checkout-cart/delivery/storepoint/collection-list/collection-list.component';

import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { StoreLocatorComponent } from './checkout-cart/delivery/storepoint/store-locator/store-locator.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { SanitizeHtmlPipePipe } from './pipe/sanitize-html-pipe.pipe';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxStarsModule } from 'ngx-stars';
import { DeliveryOptionsComponent } from './component/delivery-options/delivery-options.component';

import { MyaccountComponent } from './myaccount/myaccount.component';
import { RegistrationComponent } from './component/registration/registration.component';
import { StoreComponent } from './store/store.component';
import { ProfileFormComponent } from './component/profile-form/profile-form.component';
import {profileComponentService} from './component/profile-form/profile.service';
// import {TooltipModule} from "ngx-tooltip";
import {DeliveryComponentService} from './checkout-cart/delivery/delivery.service';
import { CustomerAccountComponent } from './component/customer-account/customer-account.component';
import { CustomerDetailComponent } from './component/customer-detail/customer-detail.component';
import { CustomerProfileFormComponent } from './component/customer-profile-form/customer-profile-form.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { DeliveryServiceComponent } from './checkout-cart/delivery/delivery-service/delivery-service.component';
import { CardFormComponent } from './paymentType/card-form/card-form.component';
import { PaypalComponent } from './paymentType/paypal/paypal.component';
import { GiftcardComponent } from './paymentType/giftcard/giftcard.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { AddressbookComponent } from './component/addressbook/addressbook.component';
import { PaymentDetailComponent } from './component/payment-detail/payment-detail.component';
import { FavouritesComponent } from './component/favourites/favourites.component';
import { OrdersComponent } from './component/orders/orders.component';
import { OrderHistoryService } from './component/orders/orders.service';
import {StorePointComponentService} from './checkout-cart/delivery/storepoint/storepoint.service';
import {cardFormComponentService} from './paymentType/card-form/card-form.service';
import { OrderConfirmationComponent } from './checkout-cart/order-confirmation/order-confirmation.component';
import { OrderPipe } from './pipe/order.pipe';
import { MbTermsComponent } from './paymentType/mb-terms/mb-terms.component';
import { NguiInViewComponent } from './component/ngui-in-view/ngui-in-view.component';
import { HotelAmenitiesComponent } from './hotel-amenities/hotel-amenities.component';
import { NewsletterSignupComponent } from './newsletter-signup/newsletter-signup.component';
import { AffliateComponent } from './affliate/affliate.component';
import { MenuComponent } from './component/menu/menu.component';

import {GiftCardService} from './paymentType/giftcard/giftcard.service';
import {GiftCardComponentService} from './gift-cards/gift-cards.service';
import {ConfirmationComponentService} from './checkout-cart/order-confirmation/order-confirmation.service';
import { NotFoundComponent } from './not-found/not-found.component';
import {AuthenticationGuardService} from './guards/authentication-guard.service';
import {RoleGuardService} from './guards/role-guard.service';
import {AuthenticationService} from './services/authentication.service';
import { PersonalFormComponent } from './component/personal-form/personal-form.component';
import { GiftCardsComponent } from './gift-cards/gift-cards.component';
import { GiftCardDetailsComponent } from './gift-cards/gift-card-details/gift-card-details.component';
import { PickMixTravelComponent } from './pick-mix-travel/pick-mix-travel.component';
import { CareerComponent } from './career/career.component';
import { CorporateGiftsComponent } from './corporate-gifts/corporate-gifts.component';
import { SaleComponent } from './sale/sale.component';
import { SpecialOffersComponent } from './special-offers/special-offers.component';
import { FeaturesComponent } from './features/features.component';
import { HeritageComponent } from './features/heritage/heritage.component';
import { LoaderComponent } from './loader/loader/loader.component';
import { CollectServiceComponent } from './checkout-cart/delivery/collect-service/collect-service.component';
import { OrdersDetailsComponent } from './component/orders/orders-details/orders-details.component';
import { NguCarouselModule } from '@ngu/carousel';
import { BalanceStatementComponent } from './gift-cards/balance-statement/balance-statement.component';
import { CardregistrationComponent } from './gift-cards/cardregistration/cardregistration.component';
import { TransferBalanceComponent } from './gift-cards/transfer-balance/transfer-balance.component';
import { CardRecoveryComponent } from './gift-cards/card-recovery/card-recovery.component';
import { StorefinderComponent } from './storefinder/storefinder.component';
import { StoreservicelistComponent } from './storeservicelist/storeservicelist.component';
import {StorefinderService} from './storefinder/storefinder.service';
import {PlacePredictionService} from './services/postcode-prediction.service';
import { GooglePlacesDirective } from './directives/google-places.directive';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PaymentService } from './component/payment-detail/payment.service'
WebFont.load({
  custom:{
    families:['font1']
  }
})
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeaderSubmenuComponent,
    HomeComponent,
    FooterComponent,
    CategorylandingPageComponent,
    ProductviewComponent,
    CategoryDetailPageComponent,
    ReviewComponent,
    CheckoutpageComponent,
    BasketpageComponent,
    BreadcrumbComponent,
    CategorybannerComponent,
    ProductSamplesComponent,
    CheckoutRegitstrationComponent,
    CheckoutCartComponent,
    ProductComponent,
    EditorialComponent,
    DeliveryComponent,
    StorepointComponent,
    DeliveryFormComponent,
    CollectionListComponent,
    StoreLocatorComponent,
    OrganisationComponent,
    SanitizeHtmlPipePipe,
    MyaccountComponent,
    RegistrationComponent,
    MyaccountComponent,
    RegistrationComponent,
    StoreComponent,
    ProfileFormComponent,
    DeliveryOptionsComponent,
    CustomerAccountComponent,
    CustomerDetailComponent,
    CustomerProfileFormComponent,
    LandingpageComponent,
    DeliveryServiceComponent,
    CardFormComponent,
    PaypalComponent,
    GiftcardComponent,
    AddressbookComponent,
    PaymentDetailComponent,
    FavouritesComponent,
    OrdersComponent,
    OrderConfirmationComponent,
    OrderPipe,
    MbTermsComponent,
    NguiInViewComponent,
    HotelAmenitiesComponent,
    NewsletterSignupComponent,
    AffliateComponent,
    MenuComponent,
    NotFoundComponent,
    PersonalFormComponent,
    GiftCardsComponent,
    GiftCardDetailsComponent,
    PickMixTravelComponent,
    CareerComponent,
    CorporateGiftsComponent,
    SaleComponent,
    SpecialOffersComponent,
    FeaturesComponent,
    HeritageComponent,
    LoaderComponent,
    CollectServiceComponent,
    OrdersDetailsComponent,
    BalanceStatementComponent,
    CardregistrationComponent,
    TransferBalanceComponent,
    CardRecoveryComponent,
    StorefinderComponent,
    StoreservicelistComponent,
    GooglePlacesDirective
     ],
  imports: [
    CommonModule, BrowserModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule, AppRoutingModule,
    SlickCarouselModule,
    DeviceDetectorModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCbvJhDVxQ2mAESdNxhP6xzU8JdTfNmTxM',
      libraries: ["places"]
    }),
    NgxStarsModule,
    TooltipModule,
    NgxPayPalModule,
    NguCarouselModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AppService,PlacePredictionService,
    cardFormComponentService,
    GoogleMapsAPIWrapper,
    DeliveryComponentService,
    profileComponentService,
    HomeComponentService,ConfirmationComponentService,
    BasketPageComponentService,productviewComponentService,
    CategoryDetailComponentService,PagerService,HeaderComponentService,
    SingletonService,CategoryComponentService,
    StorePointComponentService,
    GiftCardService,
    AuthenticationGuardService,
    RoleGuardService,
    AuthenticationService,
    GiftCardComponentService,
    OrderHistoryService,
    StorefinderService,PaymentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
