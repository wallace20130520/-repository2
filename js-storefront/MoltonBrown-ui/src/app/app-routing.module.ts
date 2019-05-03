import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategorylandingPageComponent } from './categorylanding-page/categorylanding-page.component';
import { CategoryDetailPageComponent } from './category-detail-page/category-detail-page.component';
import { CheckoutpageComponent } from './checkoutpage/checkoutpage.component';
import { BasketpageComponent } from './checkoutpage/basketpage/basketpage.component';
import { ProductSamplesComponent } from './checkoutpage/product-samples/product-samples.component';
import { CheckoutRegitstrationComponent } from './checkout-cart/checkout-regitstration/checkout-regitstration.component';
import { CheckoutCartComponent } from './checkout-cart/checkout-cart.component';
import { EditorialComponent } from './features/editorial/editorial.component';
import { DeliveryComponent } from './checkout-cart/delivery/delivery.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { MyaccountComponent } from './myaccount/myaccount.component';
import { RegistrationComponent } from './component/registration/registration.component';
import { StoreComponent } from './store/store.component';
import {ProfileFormComponent} from './component/profile-form/profile-form.component';
import {CustomerAccountComponent} from './component/customer-account/customer-account.component';
import { CustomerDetailComponent } from './component/customer-detail/customer-detail.component';
import {LandingpageComponent} from './landingpage/landingpage.component';
import {AddressbookComponent} from './component/addressbook/addressbook.component';
import{PaymentDetailComponent} from './component/payment-detail/payment-detail.component';
import {FavouritesComponent} from './component/favourites/favourites.component';
import {OrdersComponent} from  './component/orders/orders.component';
import {OrderConfirmationComponent} from './checkout-cart/order-confirmation/order-confirmation.component';
import {HotelAmenitiesComponent} from './hotel-amenities/hotel-amenities.component';
import { NewsletterSignupComponent } from './newsletter-signup/newsletter-signup.component';
import {AffliateComponent} from './affliate/affliate.component';
import {AuthenticationGuardService} from './guards/authentication-guard.service';
import {RoleGuardService} from './guards/role-guard.service';

import { GiftCardsComponent } from './gift-cards/gift-cards.component';
import { GiftCardDetailsComponent } from './gift-cards/gift-card-details/gift-card-details.component';
import { BalanceStatementComponent } from './gift-cards/balance-statement/balance-statement.component';
import {CardRecoveryComponent} from './gift-cards/card-recovery/card-recovery.component';
import {TransferBalanceComponent} from './gift-cards/transfer-balance/transfer-balance.component';
import {CardregistrationComponent} from './gift-cards/cardregistration/cardregistration.component';



import { NotFoundComponent } from './not-found/not-found.component';
import { PickMixTravelComponent } from './pick-mix-travel/pick-mix-travel.component';
import { CareerComponent } from './career/career.component';
import { CorporateGiftsComponent } from './corporate-gifts/corporate-gifts.component';
import { SaleComponent } from './sale/sale.component';
import { SpecialOffersComponent } from './special-offers/special-offers.component';
import { HeritageComponent } from './features/heritage/heritage.component';
import{FeaturesComponent} from './features/features.component';
import { OrdersDetailsComponent } from './component/orders/orders-details/orders-details.component';

import {StorefinderComponent} from './storefinder/storefinder.component';
import {StoreservicelistComponent} from './storeservicelist/storeservicelist.component';
const routes: Routes = [
    { path: '', redirectTo: 'store', pathMatch: 'full' },
    {
        path: 'store', component: StoreComponent, 
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full', data: { catalogId: 'moltonbrown-uk' } },
            { path: 'index', component: LandingpageComponent },
            { path: 'browse/:searchId', component: CategorylandingPageComponent },
            { path: 'features',component:FeaturesComponent,
             children:[
                { path: '', redirectTo: 'molton-brown-history', pathMatch: 'full' },
                { path: 'molton-brown-history', component: HeritageComponent },
                { path: 'behind-the-fragrance/jasmine-sun-rose', component: EditorialComponent } 
             ]
            },
            {path:'company/stores',component:StorefinderComponent},
            {path:'company/results',component:StoreservicelistComponent},
            {path:'careers',component:CareerComponent,pathMatch: 'full'},
            {path:'corporate-gifts',component:CorporateGiftsComponent,pathMatch: 'full'},
            { path: 'myacc', component: MyaccountComponent,
                children: [
                    { path: '', redirectTo: 'mbLogin', pathMatch: 'full' },
                    { path: 'mbLogin', component: RegistrationComponent },
                    {path:'mbRegister',component:ProfileFormComponent}
                ]
            },
            { path: 'myaccount', component: MyaccountComponent,
            children: [
                { path: '', redirectTo: 'profile', pathMatch: 'full' },
                { path: 'profile', component: CustomerAccountComponent,               
                children: [
                    { path: '', redirectTo: 'detail', pathMatch: 'full' },                    
                    { path: 'paymentInfo', component: PaymentDetailComponent },
                    { path: 'detail', component: CustomerDetailComponent},
                    { path: 'addressBook', component: AddressbookComponent },                    
                    { path: 'myFavorites', component: FavouritesComponent },                    
                    { path: 'mbOrderhistory', component: OrdersComponent },
                    { path: 'orderDetails', component: OrdersDetailsComponent}
                ]
            }
            ]
        },
            {
                path: 'mbcart', component: CheckoutpageComponent,
                children: [
                    { path: '', redirectTo: 'basket', pathMatch: 'full' },
                    { path: 'basket', component: BasketpageComponent, data: { title: 'BASKET', guest: false, catalogId: 'moltonbrown-uk' } },
                    { path: 'mbSamples', component: ProductSamplesComponent }
                ]
            },
            {path:'newsletter-sign-up',component:NewsletterSignupComponent},
            {path:'affliate',component:AffliateComponent},
            {path:'hotel-amenities',component:HotelAmenitiesComponent},
            {path:'hotel-amenities/:sitename',component:HotelAmenitiesComponent},
            {path:'hotel-amenities/:site/:sitename',component:HotelAmenitiesComponent},
            {path:'giftcards',component:GiftCardsComponent},
            {
                path:'giftcards',component:GiftCardsComponent,
                children: [
                    { path: '', redirectTo: 'check-balance', pathMatch: 'full' },
                    { path: 'check-balance', component: GiftCardDetailsComponent},
                    {path:'balanceStatement',component:BalanceStatementComponent},
                    {path:'protected/registerCard',component:CardregistrationComponent},
                    {path:'protected/transferBalance',component:TransferBalanceComponent},
                    {path:'protected/reportLostStolenCards',component:CardRecoveryComponent}
                ]
           },
            {path:'sale/:saleId',component:SaleComponent, pathMatch: 'full'},
            {path:'special-offers/:saleId',component:SpecialOffersComponent, pathMatch: 'full'},
            {path:':sitename',component:OrganisationComponent},
            { path: ':productname/:categoryId', component: CategorylandingPageComponent,runGuardsAndResolvers: 'always' },
            { path: ':categoryname/pick-mix-travel/:productid', component: PickMixTravelComponent },
            { path: ':categoryname/:productname/:productid', component: CategorylandingPageComponent,runGuardsAndResolvers: 'always' },
            { path: ':categoryname/:productname/:itemname/:itemid', component: CategoryDetailPageComponent },
         
        ]
    },
    {
        path: 'checkout', component: CheckoutCartComponent, 
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: CheckoutRegitstrationComponent },
            { path: 'shipping', component: DeliveryComponent },
            { path: 'confirmation', component: OrderConfirmationComponent },
        ]
    },
    { path: 'organisation', component: OrganisationComponent},

    {path: '404', component: NotFoundComponent},
    {path: '**', redirectTo: '/404'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
