import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CartService } from 'src/app/pages/cart/cart.service';
import { AuthAPIService } from 'src/app/pages/login/auth-api.service';
import { ProductsService } from 'src/app/pages/products/products.service';
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class HeaderComponent implements OnInit {


  open: boolean;
  submenuOpen: boolean;
  public items$ = this._cartService.items$;
  public cartTotal$;
  public totalPrice$;
  cartProducts: any;
  openCart: any;
  navMenu: {}[];
  categories: any;
  cln: HTMLElement;
  search: any;
  headerMiddle: HTMLElement;
  results: boolean;
  productSearch: any;
  products: any;
  openUser: boolean;
  authObs: Observable<any>;
  private userSub: Subscription;
  isAuthentificated: boolean;

  constructor(
    private router: Router, 
    private _cartService: CartService, 
    private _ProductsService: ProductsService, 
    private _eref: ElementRef,
    public authAPIService: AuthAPIService,) {
    this.navMenu = [
      {
        label: 'Sugestiile bucatarului',
        link: '/sugestiile-bucatarului'
      },
      {
        label: 'Locatii',
        link: '/locatii'
      },
      {
        label: 'Contact',
        link: '/contact'
      },
      {
        label: 'Cariere',
        link: '/cariere'
      }
    ];

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }


  ngOnInit(): void {

    this.getProducts();

    this._ProductsService.getCategories().then(data => {
      this.categories = data.categories;
    })

    this._cartService.totalPrice.subscribe(info => {
      this.totalPrice$ = info.toFixed(2);
    });

    this._cartService.numTotal.subscribe(info => {
      this.cartTotal$ = info;
    });

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.open = false;
      this.openCart = false;
      this.search = false;
      this.results = false;
      this.openUser = false;
    });

    if (window.outerWidth < 767) {
      this.headerMiddle = (<HTMLElement>document.querySelector('.header-middle'));

      // this.cln = (<HTMLElement>this.headerMiddle.cloneNode(true));
      // this.cln.classList.add('clone');
      // document.querySelector('.header-area').appendChild(this.cln);
    }

    this._ProductsService.getProductsAll().then(products => {
      this.products = products;
    })


    this.userSub = this.authAPIService.user.subscribe(user => {
      this.isAuthentificated = !!user;
    });
  }

  togglCart() {
    this.openCart = !this.openCart;
    this.search = false;
    this.results = false;
    this.openUser = false;
  }

  toggUser() {
    this.openUser = !this.openUser;
    this.search = false;
    this.results = false;
    this.openCart = false;
  }

  toggleMenu() {
    this.open = !this.open;
    this.search = false;
    this.results = false;
    this.openUser = false;
    this.openCart = false;
  }

  toggleSearch() {
    this.search = !this.search;
    this.results = false;
    this.openUser = false;
    this.openCart = false;
  }



  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.openUser = false;
      this.search = false;
      this.results = false;
      if (!event.target.closest('.shopping-cart-delete')) {
        this.openCart = false;
      }
    }
  }



  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const header = (<HTMLElement>document.querySelector('.header-bottom'));
    const headerRight = (<HTMLElement>document.querySelector('.header-middle-right'));
    const search = (<HTMLElement>document.querySelector('.toggle-search'));
    const searchInfo = (<HTMLElement>document.querySelector('.search-info'));
    this.search = false;
    this.results = false;
    if (window.outerWidth > 767) {
      if (window.pageYOffset > (header.getBoundingClientRect().bottom + (header.getBoundingClientRect().height * 2))) {
        header.classList.add('stick');
        headerRight.classList.add('fixed');
        search.classList.add('fixed');
        searchInfo.classList.add('fixed');
      } else {
        header.classList.remove('stick');
        headerRight.classList.remove('fixed');
        search.classList.remove('fixed');
        searchInfo.classList.remove('fixed');
      }
    } else {

      if (window.pageYOffset > 0) {
        this.headerMiddle.classList.add('fixed');
      } else if (window.pageYOffset === 0) {
        this.headerMiddle.classList.remove('fixed');
      }
    }

  }


  getProducts() {
    this.items$.pipe(
      take(1),
      map((products) => {
        this.cartProducts = products;
        this.cartTotal$;
      }),
    ).subscribe();
  }

  ngAfterViewInit() {


    let mobileMenu: HTMLElement = document.querySelector('.mobile-menu') as HTMLElement;
    let checkExist = setInterval(function () {
      if (mobileMenu && mobileMenu instanceof HTMLElement) {

        setTimeout(() => {
          $('.mobile-menu li.dropdown .dropdown-btn').on('click', function () {

            $(this).toggleClass('open');
            $(this).prev('ul').slideToggle(500);
          });
          $('.mobile-menu li a.dropdown-btn-parent_1').on('click', function () {
            $(this).next().next().toggleClass('open');
            $('.dropdon-list-toggle_1').slideToggle(500);
          });
          $('.mobile-menu li a.dropdown-btn-parent_2').on('click', function () {
            $(this).next().next().toggleClass('open');
            $('.dropdon-list-toggle_2').slideToggle(500);
          });
        }, 3000);

        clearInterval(checkExist);
      }
    }, 100); // check every 100ms

  }



  removeCart(product) {
    this._cartService.removeFromCart(product);
    this.getProducts();
  }

  onSearchChange() {

    this.results = true;

  }

  logout() {
    this.authAPIService.logout();
  }

  // onLogout() {
  //   this.authService.logout();
  // }

  // ngOnDestroy() {
  //   this.userSub.unsubscribe();
  // }
}
