import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';

import { ContactComponent } from './pages/contact/contact.component';


import { NotFoundComponent } from './components/not-found/not-found.component';
import { ThankYouComponent } from "./components/thank-you/thank-you.component";



import { GdprComponent } from './pages/gdpr/gdpr.component';
import { ConfidentialityComponent } from './pages/confidentiality/confidentiality.component';
import { CookiesComponent } from "./pages/cookies/cookies.component";
import { TermsComponent } from "./pages/terms/terms.component";
import { ProductComponent } from './pages/product/product.component';
import { ProductsComponent } from './pages/products/products.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

import { LoginComponent } from './pages/login/login.component';
import { HowToBuyComponent } from './pages/how-to-buy/how-to-buy.component';
import { HowToPayComponent } from './pages/how-to-pay/how-to-pay.component';
import { DeliveryInfoComponent } from './pages/delivery-info/delivery-info.component';
import { SuccessOrderComponent } from './pages/success-order/success-order.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { AuthGuard } from './pages/login/auth.guard';
import { AuthAPIService } from './pages/login/auth-api.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './pages/login/jwt-interceptor';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { MyOrdersComponent } from './pages/my-account/my-orders/my-orders.component';
import { OrderDetailsComponent } from './pages/my-account/order-details/order-details.component';
import { CouponsComponent } from './pages/my-account/coupons/coupons.component';
import { AddressesComponent } from './pages/my-account/addresses/addresses.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { ChefsSuggestionComponent } from './pages/chefs-suggestion/chefs-suggestion.component';
import { CareersComponent } from './pages/careers/careers.component';
import { ReturnPolicyComponent } from './pages/return-policy/return-policy.component';
import { HowToDeliverComponent } from './pages/how-to-deliver/how-to-deliver.component';
import { RecoverComponent } from './pages/recover/recover.component';
import { EasterComponent } from './pages/easter/easter.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    data: {
      title: '',
      description: '',
      ogUrl: 'your og url',
      keywords: ''
      
    }
  },


  {
    path: 'produs/:categorySlug/:productSlug', component: ProductComponent,
    data: {
      title: '',
      description: '',
      ogUrl: 'your og url',
      keywords: ''
    }
  },


  {
    path: 'produse', component: ProductsComponent,
    data: {
      title: '',
      description: '',
      ogUrl: 'your og url',
      keywords: ''
    }
  },
  
  {
    path: 'produse/:categorySlug', pathMatch: 'full', component: ProductsComponent,
    data: {
      title: '',
      description: '',
      ogUrl: 'your og url',
      keywords: ''
    }
  },

  {
    path: 'cos-cumparaturi', component: CartComponent,
    data: {
      title: '',
      description: '',
      ogUrl: 'your og url',
      keywords: ''
    }
  },

  {
    path: 'finalizeaza-comanda', component: CheckoutComponent,
    data: {
      title: '',
      description: '',
      ogUrl: 'your og url',
      keywords: ''
    }
  },
  {
    path: 'locatii', component: LocationsComponent,
    data: {
      title: '',
      description: '',
      ogUrl: 'your og url',
      keywords: ''
    }
  },
  {
    path: 'sugestiile-bucatarului', component: ChefsSuggestionComponent,
    data: {
      title: '',
      description: '',
      ogUrl: 'your og url',
      keywords: ''
    }
  },
  // {
  //   path: 'masa-de-paste-2021', component: EasterComponent,
  //   data: {
  //     title: '',
  //     description: '',
  //     ogUrl: 'your og url',
  //     keywords: ''
  //   }
  // },
  {
    path: 'cariere', component: CareersComponent,
    data: {
      title: '',
      description: '',
      ogUrl: 'your og url',
      keywords: ''
    }
  },

  // {
  //   path: 'despre-noi', component: AboutComponent,
  //   data: {
  //     title: 'Despre noi',
  //     description: '',
  //     ogUrl: 'your og url',
  //     keywords: ''
  //   }
  // },

  // {
  //   path: 'setari-gdpr', component: GdprComponent,
  //   data: {
  //     title: 'Setari GDPR',
  //     description: '',
  //     ogUrl: 'your og url',
  //     keywords: ''
  //   }
  // },

  {
    path: 'confidentialitate', component: ConfidentialityComponent,
    data: {
      title: 'Confidentialitate',
      description: '',
      ogUrl: 'your og url',
      keywords: ''
    }
  },
  {
    path: 'politica-cookies', component: CookiesComponent,
    data: {
      title: 'politica cookies',
      description: '',
      ogUrl: 'your og url',
      keywords: ''
    }
  },
  {
    path: 'termeni-si-conditii', component: TermsComponent,
    data: {
      title: 'Termeni si conditii',
      description: '',
      ogUrl: 'your og url',
      keywords: ''
    }
  },
  {
    path: 'cum-cumpar', component: HowToBuyComponent,
    data: {
      title: 'Cum cumpar',
      description: '',
      ogUrl: 'your og url',
      keywords: ''
    }
  },
  {
    path: 'cum-platesc', component: HowToPayComponent,
    data: {
      title: 'Cum platesc',
      description: '',
      ogUrl: 'your og url',
      keywords: ''
    }
  },
  // {
  //   path: 'info-livrare', component: DeliveryInfoComponent,
  //   data: {
  //     title: 'Info livrare',
  //     description: '',
  //     ogUrl: 'your og url',
  //     keywords: ''
  //   }
  // },
  {
    path: 'cum-se-livreaza', component: HowToDeliverComponent,
    data: {
      title: 'Cum platesc',
      description: '',
      ogUrl: 'your og url',
      keywords: ''
    }
  },
  {
    path: 'politica-retur', component: ReturnPolicyComponent,
    data: {
      title: 'Politica retur',
      description: '',
      ogUrl: 'your og url',
      keywords: ''
    }
  },
  {
    path: 'contact', component: ContactComponent,
    data: {
      title: 'Contact',
      description: '',
      ogUrl: 'your og url',
      keywords: ''
    }
  },
  { path: 'login', component: LoginComponent },
  { path: 'autentificare', component: LoginComponent },
  { path: 'contul-meu', component: MyAccountComponent, canActivate: [AuthGuard] },
  { path: 'comenzile-mele', component: MyOrdersComponent, canActivate: [AuthGuard] },
  { path: 'comenzile-mele/:orderUUID', component: OrderDetailsComponent, canActivate: [AuthGuard] },
  { path: 'cupoane-reducere', component: CouponsComponent, canActivate: [AuthGuard] },
  { path: 'adresele-mele', component: AddressesComponent, canActivate: [AuthGuard] },
  { path: 'am-uitat-parola', component: RecoverComponent },
  { path: 'am-uitat-parola/:token', component: RecoverComponent },


  { path: '404', component: NotFoundComponent },

  { path: 'comanda-finalizata', component: SuccessOrderComponent },
  { path: 'mesaj-trimis', component: ThankYouComponent },

  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    anchorScrolling: 'enabled'
})],
  providers: [
   // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    //fakeBackendProvider,
    //{ provide: LOCALE_ID, useValue: "ro-RO" },

    AuthAPIService
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
