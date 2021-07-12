import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';


import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


import { ContactComponent } from './pages/contact/contact.component';
import { GdprComponent } from './pages/gdpr/gdpr.component';
import { ConfidentialityComponent } from './pages/confidentiality/confidentiality.component';
import { CookiesComponent } from './pages/cookies/cookies.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { WhatsappComponent } from './components/whatsapp/whatsapp.component';
import { SliderComponent } from './pages/home/slider/slider.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { ProductSidebarComponent } from './components/layout/product-sidebar/product-sidebar.component';

import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { ShopSectionComponent } from './components/layout/shop-section/shop-section.component';
import { PromotionSectionComponent } from './components/layout/promotion-section/promotion-section.component';
import { PhotoGalleryComponent } from './components/layout/photo-gallery/photo-gallery.component';
import { TestimonialsComponent } from './components/layout/testimonials/testimonials.component';
import { ProductComponent } from './pages/product/product.component';


import { DatetimepickerComponent } from './components/datetimepicker/datetimepicker.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';


import {
  NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerModule, NgbDropdownModule,
  NgbDateNativeAdapter, NgbDate
} from "@ng-bootstrap/ng-bootstrap";
import { ProductsComponent } from './pages/products/products.component';
import { CartComponent } from './pages/cart/cart.component';
import { ToasterComponent } from './components/toaster/toaster.component'
import { ToasterContainerComponent } from './components/toaster/toaster-container.component';
import { ToastrModule } from 'ngx-toastr';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { PlaceOrderComponent } from './pages/place-order/place-order.component';

import { LoginComponent } from './pages/login/login.component';
import { UserComponent } from './pages/user/user.component';

import { AuthAPIService } from './pages/login/auth-api.service';
import { UserService } from './pages/user/user.service';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
import { PopupDiscountComponent } from './components/popup-discount/popup-discount.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { HowToBuyComponent } from './pages/how-to-buy/how-to-buy.component';
import { HowToPayComponent } from './pages/how-to-pay/how-to-pay.component';
import { DeliveryInfoComponent } from './pages/delivery-info/delivery-info.component';
import { SuccessOrderComponent } from './pages/success-order/success-order.component';
import { LightboxModule } from 'ngx-lightbox';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { MyOrdersComponent } from './pages/my-account/my-orders/my-orders.component';
import { OrderDetailsComponent } from './pages/my-account/order-details/order-details.component';
import { MustMatchDirective } from './pages/login/must-match.directive';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { CouponsComponent } from './pages/my-account/coupons/coupons.component';
import { AddressesComponent } from './pages/my-account/addresses/addresses.component';

import { ProductsCategoriesComponent } from './components/layout/products-categories/products-categories.component';
import { ProductQuickviewComponent } from './components/layout/product-quickview/product-quickview.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { LocationsComponent } from './pages/locations/locations.component';
import { ChefsSuggestionComponent } from './pages/chefs-suggestion/chefs-suggestion.component';
import { CareersComponent } from './pages/careers/careers.component';
import { ReturnPolicyComponent } from './pages/return-policy/return-policy.component';
import { HowToDeliverComponent } from './pages/how-to-deliver/how-to-deliver.component';
import { RecoverComponent } from './pages/recover/recover.component';
import { EasterComponent } from './pages/easter/easter.component';
import { RouterModule } from '@angular/router';
import { SurveyComponent } from './pages/survey/survey.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    
    HomeComponent,
    NotFoundComponent,

    ContactComponent,
    GdprComponent,
    ConfidentialityComponent,
    CookiesComponent,
    TermsComponent,
    ThankYouComponent,
    WhatsappComponent,
    SliderComponent,
    SidebarComponent,
    ProductSidebarComponent,
    MobileMenuComponent,
    ShopSectionComponent,
    PromotionSectionComponent,
    PhotoGalleryComponent,
    TestimonialsComponent,
    ProductComponent,
    DatetimepickerComponent,
    ProductsComponent,
    CartComponent,
    ToasterComponent,
    ToasterContainerComponent,
    CheckoutComponent,
    PlaceOrderComponent,
    
    LoginComponent,
    UserComponent,
    PopupDiscountComponent,
    HowToBuyComponent,
    HowToPayComponent,
    DeliveryInfoComponent,
    SuccessOrderComponent,
    MyAccountComponent,
    MyOrdersComponent,
    OrderDetailsComponent,
    MustMatchDirective,
    MaintenanceComponent,
    CouponsComponent,
    AddressesComponent,
    ProductsCategoriesComponent,
    ProductQuickviewComponent,
    LocationsComponent,
    ChefsSuggestionComponent,
    CareersComponent,
    ReturnPolicyComponent,
    HowToDeliverComponent,
    RecoverComponent,
    EasterComponent,
    SurveyComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    CarouselModule,
    NgbModule,
    
    ToastrModule.forRoot(),
    SocialLoginModule,
    YouTubePlayerModule,
    LightboxModule,
    
    Ng2SearchPipeModule,
   
  ],
  exports: [],
  providers: [
    {
      provide: NgbDateAdapter,
      useClass: NgbDateNativeAdapter,
      
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '372049907460-9moutp3bta2e9o9nj2hjcgaeja1iodnb.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('2526902350945893')
          }
        ]
      } as SocialAuthServiceConfig,
    },
    
      NgbActiveModal
    

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
