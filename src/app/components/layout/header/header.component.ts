import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { CartService } from 'src/app/pages/cart/cart.service';
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

  constructor(private router: Router, private _cartService: CartService, private _ProductsService: ProductsService, private _eref: ElementRef) {
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
        link: '/'
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
    });

    if(window.outerWidth < 767) {
      this.headerMiddle = (<HTMLElement>document.querySelector('.header-middle'));

      // this.cln = (<HTMLElement>this.headerMiddle.cloneNode(true));
      // this.cln.classList.add('clone');
      // document.querySelector('.header-area').appendChild(this.cln);
    }
  }

  togglCart() {
    this.openCart = !this.openCart;
  }

  toggleMenu() {
    this.open = !this.open;
  }

  toggleSearch() {
   this.search = !this.search
  }

  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.openCart = false;
    }
  }

 

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const header = (<HTMLElement>document.querySelector('.header-bottom'));
    if(window.outerWidth > 767) {
      if (window.pageYOffset > (header.getBoundingClientRect().bottom + (header.getBoundingClientRect().height * 2))) {
        header.classList.add('stick');
      } else {
        header.classList.remove('stick');
      }
    } else {
      this.search = false;
      if (window.pageYOffset > 0) {
        this.headerMiddle.classList.add('fixed');
      } else if(window.pageYOffset === 0) {
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
            console.log($('.dropdon-list-toggle_1'))
            $(this).next().next().toggleClass('open');
            $('.dropdon-list-toggle_1').slideToggle(500);
          });
          $('.mobile-menu li a.dropdown-btn-parent_2').on('click', function () {
            console.log($('.dropdon-list-toggle_2'))
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

  // onLogout() {
  //   this.authService.logout();
  // }

  // ngOnDestroy() {
  //   this.userSub.unsubscribe();
  // }
}