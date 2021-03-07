import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { from, Observable, Subscription } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';
import { AuthAPIService, AuthResponseData } from '../login/auth-api.service';
import { User } from '../user/user.model';
import { SocialAuthService, SocialLoginModule } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { UserService } from '../user/user.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [SocialLoginModule, AuthAPIService, UserService]
})
export class CheckoutComponent implements OnInit {
  @ViewChild('sendOrder') ngForm: NgForm;

  order: any = {};
  discount: number = 0;
  payment: any;
  note_box: any = '';
  accessories: any;
  show: boolean = false;
  terms: any;
  gdpr: any;
  location: string;

  private CHECK_COUPON = "https://tavacudetoate.ro/tavacudetoate-api/v1/coupon/check";
  private USE_COUPON = "https://tavacudetoate.ro/tavacudetoate-api/v1/coupon/use";

  discountCode: any;
  deliverydate: string;
  interval: any;

  authObs: Observable<any>;
  private userSub: Subscription;
  isAuthentificated: boolean;
  user: User;
  addresses: any = [];
  selectedAddress: any = 0;
  public userPostData = {
    email: '',
    name: '',
    provider: '',
    provider_id: '',
    provider_pic: '',
    token: ''
  };
  public responseData: any;
  showForm: boolean;
  newAddress: boolean;
  selectedLocation: any;
  selectDeliveryLocaiton: any;


  constructor(
    private cartService: CartService,
    private _httpClient: HttpClient,
    private toaster: ToastrService,
    public router: Router,
    public authAPIService: AuthAPIService,
    private SocialAuthService: SocialAuthService,
    public userService: UserService,
  ) { }

  private SEND_ORDER = "https://tavacudetoate.ro/data/sendOrder.php";
  private ADD_ORDER = "https://tavacudetoate.ro/tavacudetoate-api/v1/order/add";
  public items$ = this.cartService.items$;
  public products;
  public totalPrice$;
  model: any = {};
  delivery: any = {};
  login: any = {};


  formGroup: FormGroup;
  dateModel: Date = new Date();

  stringDateModel: string = new Date().toString();



  ngOnInit(): void {
    this.items$.subscribe(data => {
      this.products = data;
    })


    this.userSub = this.authAPIService.user.subscribe(user => {
      this.isAuthentificated = !!user;
      if (this.isAuthentificated) {
        this.user = user;
        this.getAddresses(user);
      }
    });

    this.formGroup = new FormGroup({
      activeEndDate: new FormControl(new Date(), { validators: [Validators.required, DateTimeValidator] })
    }, { updateOn: 'change' });

    this.getTotalPrice();

  }

  send() {
    this.ngForm.ngSubmit.emit();
  }

  toggle() {
    this.show = !this.show;
  }

  showAuth() {
    this.showForm = !this.showForm;
  }

  getTotalPrice() {
    this.cartService.totalPrice.subscribe(info => {
      this.totalPrice$ = info.toFixed(2);
    });
  }

  selectDelivery(event) {
    this.location = event.target.value;
    console.log(event.target.value)
    if (this.location != 'livreaza') {
      this.getLocations(this.location);
    } else {
      this.discount = 0;
      this.selectedLocation = '';
      this.selectDeliveryLocaiton = '';
      this.getTotalPrice();
    }
  }

  getLocations(location) {
    this._httpClient.get('https://tavacudetoate.ro/tavacudetoate-api/v1/locations/' + location).subscribe((data: any) => {
      this.selectedLocation = data;
    });
  }

  deliveryLocation(location) {
    this.selectDeliveryLocaiton = location;
    this.discount = 15;
    this.totalPrice$ = (this.totalPrice$ - (this.totalPrice$ * this.discount / 100)).toFixed(2);
  }

  toggleNewAddress() {
    this.newAddress = !this.newAddress;

    if (this.newAddress) {
      this.selectedAddress = 0;
    } else {
      this.selectedAddress = this.addresses[0];
    }
  }

  getData() {
    return JSON.parse(localStorage.getItem('discountApplied'));
  }

  checkDiscount() {
    if (this.model.email) {
      this._httpClient.post(this.CHECK_COUPON, { email: this.model.email, coupon: this.discountCode }).subscribe((data: any) => {
        if (data.success === true) {

          this.discount = data.percent;
          this.totalPrice$ = this.totalPrice$ - (this.totalPrice$ * this.discount / 100);
          this._httpClient.post(this.USE_COUPON, { email: this.model.email, coupon: this.discountCode }).subscribe((data: any) => {
            if (data.success === true) {
              this.toaster.success('Iti multumim!', `${data.message}`, {
                timeOut: 3000,
                positionClass: 'toast-bottom-right'
              });
            }
          })

        } else {
          this.toaster.warning('', `${data.message}`, {
            timeOut: 3000,
            positionClass: 'toast-bottom-right'
          });
        }
      })
    } else {
      this.toaster.warning('', 'Te rugam sa introduci adresa de email!', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
    }

  }


  addDeliveryDate(date) {
    this.deliverydate = `${date.datetime.day + '.' + date.datetime.month + '.' + date.datetime.year}`;
    this.interval = date.interval;
  }



  placeOrder(f: NgForm) {

    if (!this.location) {
      this.toaster.warning('Te rugam sa alegi modalitatea de livrare!', 'Comanda nu poate fi trimisa!', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
      return;
    }


    if (this.location != 'livreaza' && !this.selectDeliveryLocaiton) {
      this.toaster.warning('Te rugam sa alegi locatia de unde vrei sa ridici comanda!', 'Comanda nu poate fi trimisa!', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
      return;
    }

    if (!this.terms) {
      this.toaster.warning('Trebuie sa fii de acord cu termenii si conditiile site-ului!', 'Comanda nu poate fi trimisa!', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
      return;
    }

    if (!this.gdpr) {
      this.toaster.warning('Trebuie sa fii de acord cu politica de confidentialitate a site-ului!', 'Comanda nu poate fi trimisa!', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
      return;
    }

    // if (!form.errors) {
    //   this.toaster.warning('Va rugam sa completati toate campurile obligatorii!', 'Comanda nu poate fi trimisa!', {
    //     timeOut: 3000,
    //     positionClass: 'toast-bottom-right'
    //   });
    //   return;
    // }

    if (!this.deliverydate) {
      this.toaster.warning('Comanda nu poate fi trimisa!', 'Te rugam sa alegi data livraii!', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
      return;
    }

    // if (!this.interval) {
    //   this.toaster.warning('Comanda nu poate fi trimisa!', 'Te rugam sa alegi intervalul de livrare!', {
    //     timeOut: 3000,
    //     positionClass: 'toast-bottom-right'
    //   });
    //   return;
    // }

    if (!this.payment) {
      this.toaster.warning('Comanda nu poate fi trimisa!', 'Te rugam sa alegi metoda de plata!', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
      return;
    }

    const accepted = ['bucuresti', 'pitesti'];
    
    if(this.location == 'livreaza' && !accepted.includes(this.model.town_city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) {
      this.toaster.warning('Comanda nu poate fi trimisa!', 'Ne pare rau, momentan livram doar in Bucuresti si Pitesti', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
      return;
    } 

    this.order = [
      {
        total: this.totalPrice$,
        discount: this.discount,
        method: this.payment,
        notes: this.note_box,
        products: this.products,
        accessories: this.products.accessories,
        deliverydate: this.deliverydate,
        //intervaldelivery: this.interval
      }
    ];

   

    if (this.location != 'livreaza') {

      this.order[0].customer = {
        firstName: this.delivery.firstName,
        lastName: this.delivery.lastName,
        email: this.delivery.email,
        phone: this.delivery.phone,
        contact_phone: this.selectDeliveryLocaiton.phone,
        contact_email: this.selectDeliveryLocaiton.email,
        shippingAddress: {
          address: 'Ridicare personala din: ' + this.selectDeliveryLocaiton.location_name,
          town: this.selectDeliveryLocaiton.town,
          county: this.selectDeliveryLocaiton.county,
        }
      }

    } else {

      this.order[0].customer = {
        firstName: this.model.firstName,
        lastName: this.model.lastName,
        email: this.model.email,
        phone: this.model.phone,
        contact_email: (this.model.town_city == 'Bucuresti' ? 'comenzi.bucureresti@tavacudetoate.ro' : 'comenzi.pitesti@tavacudetoate.ro'),
        shippingAddress: {
          address: (this.model.address_1 ? this.model.address + ' ' + this.model.address_1 : this.model.address),
          town: this.model.town_city,
          county: this.model.county,
        }
      }
    }

    if (this.isAuthentificated) {
      let userInfo = {};
      if (this.selectedAddress != 0) {
        userInfo = {
          user_id: this.user.id,
          address_id: this.selectedAddress.id
        }

        this.order[0]['customer'] = {
          firstName: this.user.name,
          lastName: this.user.last_name,
          email: this.user.email,
          phone: this.selectedAddress.phone,
          shippingAddress: {
            address: this.selectedAddress.address,
            town: this.selectedAddress.town,
            county: this.selectedAddress.county,
          }
        }

        this.order.push(userInfo);
      } else {
        userInfo = {
          user_id: this.user.id,
          phone: this.model.phone,
          address: (this.model.address_1 ? this.model.address + ' ' + this.model.address_1 : this.model.address),
          town: this.model.town_city,
          county: this.model.county,
        }

        this.order[0]['customer'].shippingAddress = {
          address: (this.model.address_1 ? this.model.address + ' ' + this.model.address_1 : this.model.address),
          town: this.model.town_city,
          county: this.model.county,
        }


        this.order.push(userInfo);
      }
    }

    console.log(this.order);

    // this._httpClient.post(this.SEND_ORDER, this.order).subscribe((data: any) => {
    //   if (data.status == "success") {

    //     this.toaster.success('Va multumim!', `${data.message}`, {
    //       timeOut: 3000,
    //       positionClass: 'toast-bottom-right'
    //     });

    //     // this.cartService.emptyCart();
    //     // form.reset();
    //   }
    // })


    this._httpClient.post(this.ADD_ORDER, this.order).subscribe((data: any) => {
      if (data.status == "success") {
        this._httpClient.post(this.SEND_ORDER, this.order).subscribe((data: any) => {
          if (data.status == "success") {

            this.toaster.success('Iti multumim!', `${data.message}`, {
              timeOut: 3000,
              positionClass: 'toast-bottom-right'
            });

            // if (this.discount > 0) {
            //   this._httpClient.post(this.USE_COUPON, { email: this.model.email, coupon: this.discountCode }).subscribe((data: any) => {

            //   })
            // }

            this.cartService.emptyCart();
            f.reset();
            this.router.navigate(['/comanda-finalizata']);
          }
        })
      }
    });
  }

  auth(form: NgForm) {
    let authObs: Observable<AuthResponseData>;

    authObs = this.authAPIService.login(this.login.email, this.login.password);
    authObs.subscribe(data => {

      if (data['success']) {
        this.toaster.success('', `${data['message']}`, {
          timeOut: 8000,
          positionClass: 'toast-bottom-right'
        });


      } else {
        this.toaster.warning('', `${data['message']}`, {
          timeOut: 8000,
          positionClass: 'toast-bottom-right'
        });
        form.reset();
      }

    }, error => {
      console.log(error)
    });

  }

  getAddresses(user) {

    this._httpClient.get<any>(`https://tavacudetoate.ro/tavacudetoate-api/v1/addresses/${user.id}`).subscribe(addresses => {
      this.addresses = addresses.data;
      this.selectedAddress = this.addresses[0];

    })
  }
  selectAddress(addressIndex, event) {
    this.selectedAddress = this.addresses[addressIndex];
    const active = document.querySelectorAll('.shipping-address-box.active');
    for (let i = 0; i < active.length; i++) {
      active[i].classList.remove('active');
    }
    event.target.closest(".shipping-address-box").classList.add('active');
  }

  signInWithGoogle(): void {
    this.SocialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(userData => {
      this.apiConnection(userData);
    });;
  }

  signInWithFB(): void {
    this.SocialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(userData => {
      this.apiConnection(userData);
    });;
  }

  signOut(): void {
    this.SocialAuthService.signOut();
  }

  apiConnection(data) {
    this.userPostData.email = data.email;
    this.userPostData.name = data.name;
    this.userPostData.provider = data.provider;
    this.userPostData.provider_id = data.id;
    this.userPostData.provider_pic = data.photoUrl;
    this.userPostData.token = data.authToken;

    this.authAPIService.postData(this.userPostData, 'signup').then(
      result => {
        this.responseData = result;
        if (this.responseData.userData) {
          console.log(this.responseData)
          this.userService.storeData(this.responseData.userData);

        }
      },
      err => {
        console.log('error');
      }
    );
  }
}

export const DateTimeValidator = (fc: FormControl) => {
  const date = new Date(fc.value);
  const isValid = !isNaN(date.valueOf());
  return isValid ? null : {
    isValid: {
      valid: false
    }
  };
};
