import { Component, ElementRef, OnInit } from '@angular/core';
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

  constructor(private router: Router, private _cartService: CartService, private _ProductsService: ProductsService, private _eref: ElementRef) {
    this.navMenu = [
      {
        label: 'Delicii',
        link: '/delicii'
      },
      {
        label: 'Vegetarian',
        link: '/vegetarial'
      },
      {
        label: 'Locatii',
        link: '/locatii'
      },
      {
        label: 'Contact',
        link: '/'
      }
    ]
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

    });

    console.log(this.cartProducts)
  }

  togglCart() {
    this.openCart = !this.openCart;
  }

  toggleMenu() {
    this.open = !this.open;

  }

  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.openCart = false;
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
