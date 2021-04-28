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
import { take, map } from 'rxjs/operators';


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
  EP: boolean;
  newAddress: boolean;
  selectedLocation: any;
  selectDeliveryLocation: any;
  discountDelivery: number;
  status: { name: string; color: string; }[];
  showEPForm: boolean = false;
  order_guid: any;
  showForm: boolean;
  showInvoicePJ: boolean = false;
  userCompleteName: any;


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
  limit: number = 99;

  isInvoice: string;
  invoice: boolean = false;
  invoicePj: any = {};


  formGroup: FormGroup;
  dateModel: Date = new Date();

  stringDateModel: string = new Date().toString();
  private euplatesctSend: string;
  private dataBill;
  public dataAll;



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

    if (this.discount > 0) {
      this.cartService.totalPrice.subscribe(info => {
        this.totalPrice$ = info.toFixed(2);
        this.totalPrice$ = (this.totalPrice$ - (this.totalPrice$ * this.discount / 100)).toFixed(2);
      });

    } else if (this.discountDelivery > 0) {
      this.cartService.totalPrice.subscribe(info => {
        this.totalPrice$ = info.toFixed(2);
        this.totalPrice$ = (this.totalPrice$ - (this.totalPrice$ * this.discountDelivery / 100)).toFixed(2);
      });
    } else {
      this.cartService.totalPrice.subscribe(info => {
        this.totalPrice$ = info.toFixed(2);
      });
    }

    if (this.totalPrice$ < 99 && !this.discount && !this.discountDelivery) {
      this.router.navigate(['/cos-cumparaturi']);
    }

  }

  selectDelivery(event) {
    this.location = event.target.value;
    if (this.location != 'livreaza') {
      this.getLocations(this.location);
    } else {
      this.discountDelivery = 0;
      this.selectedLocation = '';
      this.selectDeliveryLocation = '';
      this.getTotalPrice();
    }
  }

  getLocations(location) {
    this._httpClient.get('https://tavacudetoate.ro/tavacudetoate-api/v1/locations/' + location).subscribe((data: any) => {
      this.selectedLocation = data;
    });
  }

  deliveryLocation(location) {
    this.selectDeliveryLocation = location;
    this.delivery.firstName = this.user.name;
    this.delivery.email = this.user.email;
    if(this.addresses && this.addresses[0].phone) {
      this.delivery.phone = this.addresses[0].phone;
    }
   

    let checkName = this.user.name.split(" ");
    if(checkName.includes(this.user.last_name)) {
      this.delivery.firstName = checkName[0];
      this.delivery.lastName = checkName[1];
    } else {
      this.delivery.firstName = this.user.name;
      this.delivery.lastName = this.user.last_name;
    }
    //this.discount = 0;

    if (this.discountDelivery > 0)
      return;

    if (!this.discount) {
      this.discountDelivery = 15;
    } else if(this.discount == 10) {
      this.discountDelivery = 15;
      this.discount = 0;
    }

    this.getTotalPrice();
  }

  onChangeDeliveryFirstName(newValue) {
    this.delivery.firstName = newValue;
  }

  onChangeDeliveryLastName(newValue) {
    this.delivery.lastName = newValue;
  }

  onChangeDeliveryEmail(newValue) {
    this.delivery.email = newValue;
  }

  onChangeDeliveryPhone(newValue) {
    this.delivery.phone = newValue;
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

   

    if (this.discountCode.toUpperCase() === 'PASTE10' || this.discountCode.toUpperCase() === 'BUCURIA10') {
      this.toaster.success('Iti multumim!', `Reducerea a fost aplicata cu succes`, {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });

      if(this.selectDeliveryLocation) {
        this.discountDelivery = 15;
        this.discount = 0;
      } else {
        this.discount = 10;
        this.discountDelivery = 0;
      }
      

      
      this.getTotalPrice();

    } else {
      this.toaster.warning('', `Acest cupon nu este valabil!`, {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
    }

    // if (this.model.email) {
    //   this._httpClient.post(this.CHECK_COUPON, { email: this.model.email, coupon: this.discountCode }).subscribe((data: any) => {
    //     if (data.success === true) {

    //       this.discount = data.percent;
    //       this.totalPrice$ = this.totalPrice$ - (this.totalPrice$ * this.discount / 100);
    //       this._httpClient.post(this.USE_COUPON, { email: this.model.email, coupon: this.discountCode }).subscribe((data: any) => {
    //         if (data.success === true) {
    //           this.toaster.success('Iti multumim!', `${data.message}`, {
    //             timeOut: 3000,
    //             positionClass: 'toast-bottom-right'
    //           });
    //         }
    //       })

    //     } else {
    //       this.toaster.warning('', `${data.message}`, {
    //         timeOut: 3000,
    //         positionClass: 'toast-bottom-right'
    //       });
    //     }
    //   })
    // } else {
    //   this.toaster.warning('', 'Te rugam sa introduci adresa de email!', {
    //     timeOut: 3000,
    //     positionClass: 'toast-bottom-right'
    //   });
    // }

  }


  addDeliveryDate(date) {
    this.deliverydate = `${date.datetime.day + '.' + date.datetime.month + '.' + date.datetime.year}`;
    // this.interval = date.interval;
  }


  selectInvoice(event) {
    // if(event.target.value == 'pf') {
    //   this.showInvoicePJ = false;      
    // } else if(event.target.value == 'pj'){
    //   this.showInvoicePJ = true;
    // }
    this.showInvoicePJ = !this.showInvoicePJ;
    //this.isInvoice = event.target.value;  
  }



  placeOrder(f: NgForm) {

    if (!this.location) {
      this.toaster.warning('Te rugam sa alegi modalitatea de livrare!', 'Comanda nu poate fi trimisa!', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
      return;
    }


    if (this.location != 'livreaza' && !this.selectDeliveryLocation) {
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
      this.toaster.warning('Comanda nu poate fi trimisa!', 'Te rugam sa alegi data livrarii!', {
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

    if (this.location == 'livreaza' && !accepted.includes(this.model.town_city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) {
      this.toaster.warning('Comanda nu poate fi trimisa!', 'Ne pare rau, momentan livram doar in Bucuresti si Pitesti', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
      return;
    }


    this.order = [
      {
        total: this.totalPrice$,
        method: this.payment,
        notes: this.note_box,
        products: this.products,
        accessories: this.products.accessories,
        deliverydate: this.deliverydate,
        intervaldelivery: '',
        invoicePj: this.invoicePj,
        // isInvoice: (this.isInvoice == 'pf' ? true : false),
        isInvoice: false,

        // isInvoicePJ: (this.isInvoice == 'pj' ? true : false),
        isInvoicePJ: this.showInvoicePJ,
        sendOrderEmail: 'comenzi@tavacudetoate.ro',

      }
    ];

    if (this.discount) {
      this.order[0].discount = this.discount;
    } else if (this.discountDelivery) {
      this.order[0].discount = this.discountDelivery;
    } else {
      this.order[0].discount = 0;
    }


    if (this.invoicePj) {
      this.order[0].invoicePj = {
        companyName: this.invoicePj.companyName,
        companyAddress: this.invoicePj.companyAddress,
        registryNumber: this.invoicePj.J + ' ' + this.invoicePj.J1 + ' ' + this.invoicePj.J2 + ' ' + this.invoicePj.J3,
        cui: this.invoicePj.prefcode + ' ' + this.invoicePj.cui
      }
    }






    if (this.location != 'livreaza') {

      this.order[0].contact_phone = this.selectDeliveryLocation.phone;
      this.order[0].pretty_contact_phone = this.selectDeliveryLocation.pretty_phone;
      this.order[0].contact_email = this.selectDeliveryLocation.email;
      if (this.selectDeliveryLocation.county == 'Arges') {
        this.order[0].additionalSendOrderEmail = 'comanvvv@yahoo.com';
      } else if (this.selectDeliveryLocation.county == 'Sector 1' || this.selectDeliveryLocation.county == 'Sector 5' || this.selectDeliveryLocation.county == 'Sector 6') {
        this.order[0].additionalSendOrderEmail = 'cristian.stanga88@gmail.com';
      } else {
        this.order[0].additionalSendOrderEmail = 'bursucvictor@yahoo.com';
      }


      this.order[0].customer = {
        user_id: 0,
        firstName: this.delivery.firstName,
        lastName: this.delivery.lastName,
        email: this.delivery.email,
        phone: this.delivery.phone,

        shippingAddress: {
          address: 'Ridicare personala din: ' + this.selectDeliveryLocation.location_name,
          town: this.selectDeliveryLocation.town,
          county: this.selectDeliveryLocation.county,
        }
      }

    } else {


      if (this.model.town_city == 'Pitesti') {
        this.model.county = 'Arges'
      }

      if (this.model.county == 'Arges') {
        this.order[0].additionalSendOrderEmail = 'comanvvv@yahoo.com';
        this.order[0].contact_email = 'comenzi@tavacudetoate.ro';

        this.order[0].contact_phone = '0746252899';
        this.order[0].pretty_contact_phone = '(0746) 252 899';
      } else if (this.model.county == 'Sector 1' || this.model.county == 'Sector 5' || this.model.county == 'Sector 6') {
        this.order[0].additionalSendOrderEmail = 'cristian.stanga88@gmail.com';
        this.order[0].contact_email = 'comenzi@tavacudetoate.ro';
        this.order[0].contact_phone = '0741285044';
        this.order[0].pretty_contact_phone = '(0741) 285 044';
      } else {
        this.order[0].contact_phone = '0720.612.962';
        this.order[0].pretty_contact_phone = '(0720) 612 962';
        this.order[0].additionalSendOrderEmail = 'bursucvictor@yahoo.com';
        this.order[0].contact_email = 'comenzi@tavacudetoate.ro';
      }

      this.order[0].customer = {
        user_id: 0,
        firstName: this.model.firstName,
        lastName: this.model.lastName,
        email: this.model.email,
        phone: this.model.phone,
        shippingAddress: {
          address: 'Adresa de livrare: ' + (this.model.address_1 ? this.model.address + ' ' + this.model.address_1 : this.model.address),
          town: this.model.town_city,
          county: this.model.county,
        }
      }
    }

    if (this.isAuthentificated) {

      if (this.selectedAddress != 0 && this.selectedAddress != undefined && this.location == 'livreaza') {

        this.order[0]['customer'] = {
          user_id: this.user.id,
          address_id: this.selectedAddress.id,
          firstName: this.user.name,
          lastName: (this.user.last_name ? this.user.last_name : ''),
          email: this.user.email,
          phone: this.selectedAddress.phone,
          shippingAddress: {
            address: 'Adresa de livrare: ' + this.selectedAddress.address,
            town: this.selectedAddress.town,
            county: this.selectedAddress.county,
          }
        }

        if (this.selectedAddress.county == 'Arges') {
          this.order[0].additionalSendOrderEmail = 'comanvvv@yahoo.com';
          this.order[0].contact_email = 'comenzi@tavacudetoate.ro';

          this.order[0].contact_phone = '0746252899';
          this.order[0].pretty_contact_phone = '(0746) 252 899';
        } else if (this.selectedAddress.county == 'Sector 1' || this.selectedAddress.county == 'Sector 5' || this.selectedAddress.county == 'Sector 6') {
          this.order[0].additionalSendOrderEmail = 'cristian.stanga88@gmail.com';
          this.order[0].contact_email = 'comenzi@tavacudetoate.ro';
          this.order[0].contact_phone = '0741285044';
          this.order[0].pretty_contact_phone = '(0741) 285 044';
        } else {
          this.order[0].contact_phone = '0720.612.962';
          this.order[0].pretty_contact_phone = '(0720) 612 962';
          this.order[0].additionalSendOrderEmail = 'bursucvictor@yahoo.com';
          this.order[0].contact_email = 'comenzi@tavacudetoate.ro';
        }

      } else if (this.selectedAddress != 0 && this.selectedAddress != undefined && this.location != 'livreaza') {
        this.order[0]['customer'] = {
          user_id: this.user.id,
          firstName: this.delivery.firstName,
          lastName: this.delivery.lastName,
          email: this.delivery.email,
          phone: this.delivery.phone,
          shippingAddress: {
            address: 'Ridicare personala din: ' + this.selectDeliveryLocation.location_name,
            town: this.selectDeliveryLocation.town,
            county: this.selectDeliveryLocation.county,
          }
        }
      } else if (this.selectedAddress == 0 && this.location != 'livreaza') {


        this.order[0].customer = {
          user_id: this.user.id,
          firstName: this.delivery.firstName,
          lastName: this.delivery.lastName,
          email: this.delivery.email,
          phone: this.delivery.phone,

          shippingAddress: {
            address: 'Ridicare personala din: ' + this.selectDeliveryLocation.location_name,
            town: this.selectDeliveryLocation.town,
            county: this.selectDeliveryLocation.county,
          }
        }
      } else {

        this.order[0]['customer'] = {
          user_id: this.user.id,
          firstName: this.user.name,
          lastName: (this.user.last_name ? this.user.last_name : ''),
          email: this.user.email,
          phone: this.model.phone,
          shippingAddress: {

            address: 'Adresa de livrare: ' + (this.model.address_1 ? this.model.address + ' ' + this.model.address_1 : this.model.address),
            town: this.model.town_city,
            county: this.model.county,
          }

        }
      }
    }


    if (this.order[0].method == 'card online') {

      this.status = [
        {
          name: 'Awaiting payment',
          color: 'blue-500',
        }
      ]
    } else {
      this.status = [
        {
          name: 'Order placed',
          color: 'blue-500',
        }
      ]
    }
    this.order[0].status = this.status;

   //console.log(this.order)


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
        let dataSend = {
          amount: this.order[0].total,
          invoice_id: data.order_guid
        };
        this.order_guid = data.order_guid;
        this.order[0].order_guid = data.order_guid;
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

            if (this.order[0].method == 'card online') {

              this.status = [
                {
                  name: 'Awaiting payment',
                  color: 'blue-500',
                }
              ]

              if (this.order[0]['customer'].shippingAddress.town == 'Bucuresti') {
                this.euplatesctSend = "https://tavacudetoate.ro/payment/ep_send_bucuresti.php"
              } else {
                this.euplatesctSend = "https://tavacudetoate.ro/payment/ep_send_pitesti.php"
              }
              this._httpClient.post(this.euplatesctSend, dataSend)
                .pipe(
                  take(1),
                  map((response) => {

                    this.dataAll = response;
                    this.showEPForm = true;
                    return response;
                  }),
                )
                .subscribe((data: any) => {
                  if (data) {
                    setTimeout(() => {

                      this.toaster.success('Iti multumim!', 'Vei fi redirectionat catre EuPlatesc!', {
                        timeOut: 3000,
                        positionClass: 'toast-bottom-right'
                      });

                      this.submit();
                      this.cartService.emptyCart();
                      f.reset();


                    }, 1000);
                  }
                })
            } else {
              this.cartService.emptyCart();
              f.reset();

              this.router.navigate(['/comanda-finalizata']);

            }


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

    });

  }

  getAddresses(user) {

    this._httpClient.get<any>(`https://tavacudetoate.ro/tavacudetoate-api/v1/addresses/${user.id}`).subscribe(addresses => {
      this.addresses = addresses.data;
      
      let checkName = user.name.split(" ");
      if(checkName.includes(user.last_name)) {
        this.userCompleteName = user.name;
      } else {
        this.userCompleteName = user.name + ' ' + user.last_name;
      }
      if (addresses.data.length > 0) {
        this.selectedAddress = this.addresses[0];
        this.model.town_city = this.selectedAddress.town;
        this.model.county = this.selectedAddress.county;
      }

    })
  }
  selectAddress(addressIndex, event) {
    this.selectedAddress = this.addresses[addressIndex];
    this.model.town_city = this.selectedAddress.town;


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

          this.userService.storeData(this.responseData.userData);

        }
      },
      err => {

      }
    );
  }

  submit() {
    const epForm = <HTMLFormElement>document.getElementById('epForm');

    epForm.submit();

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
