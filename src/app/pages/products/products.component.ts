import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProductsService } from './products.service';
import { Product } from '../product/product.model'
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { CartService } from '../cart/cart.service';
import { v4 as uuidv4 } from 'uuid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductQuickviewComponent } from 'src/app/components/layout/product-quickview/product-quickview.component';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  private _categoryRoute: string;
  public products: any;
  public totalNoOfProducts: any;
  public currentPage: number = 1;
  public totalPages: number = 1;
  public pages: number[] = [];
  categories: any;


  /**
   * Constructor
   *
   * @param {ProductsService} _ProductsService
   * @param {ActivatedRoute} _route
   * @param {Router} router
   * @param {CartService} _cartService
   * 
   */

  constructor(
    private _route: ActivatedRoute,
    private _ProductsService: ProductsService,
    private _cartService: CartService,
    public router: Router,
    public modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this._categoryRoute = params.get('categorySlug');
    });

    this._ProductsService.getCategories().then(data => {
      this.categories = data.categories;
    })
  }

  
  ngAfterViewInit() {
    this.getProducts();

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.getProducts();
    });
  }

  getProducts() {
    if (!this._categoryRoute) {
      this._ProductsService.getProducts('').then(data => {
        console.log(data)
        this.totalNoOfProducts = data.total_no_of_products;
        this.products = data.products;

        this.setTotalPages(data.no_of_pages);
        this.setPagesArray(this.totalPages);
      });

      this.moveToTop();

    } else {
      this._ProductsService.getProducts(this._categoryRoute).then(data => {
        this.totalNoOfProducts = data.total_no_of_products;
        this.products = data.products;

        this.setTotalPages(data.no_of_pages);
        this.setPagesArray(this.totalPages);
        console.log(this.products)
        this._ProductsService.getCategory(this._categoryRoute);

        this.moveToTop();
      });

    }
    
    // console.log(window.pageYOffset);
    // const shopElement = (<HTMLElement>document.querySelector('.shop-page-section')).offsetTop;
    // if(window.pageYOffset > shopElement)

  }

  moveToTop() {
    const scrollToContainer = document.querySelector('.shop-page-section');
    if(window.innerWidth > 991 && scrollToContainer) {
      scrollToContainer.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const sidebar = (<HTMLElement>document.querySelector('.shop-sidebar-wrapper'));
    const width = sidebar.parentElement.getBoundingClientRect().width - 32;
    const left = sidebar.parentElement.getBoundingClientRect().left + 16;
    const footer = (<HTMLElement>document.querySelector('.footer-area'));
    const body = (<HTMLElement>document.querySelector('body'));

    if(window.outerWidth > 767) {
      if (window.pageYOffset > 280 && window.pageYOffset < body.offsetHeight - (footer.getBoundingClientRect().height * 2)) {
        sidebar.classList.add('stick');
        sidebar.style.width = width + 'px';
        sidebar.style.left = left + 'px';
        sidebar.style.top = 84 + 'px';
        sidebar.style.removeProperty('position');
        sidebar.style.removeProperty('bottom');

      } else if(window.outerWidth > body.offsetHeight - (footer.getBoundingClientRect().height * 2) && sidebar.classList.contains('stick') && window.outerWidth !< 280) {
        sidebar.style.position = 'absolute';
        sidebar.style.bottom = -80 + 'px';
        sidebar.style.top = 'auto';
        sidebar.style.left = 0 + 'px';
        sidebar.style.width = width + 'px';
      } else {
        sidebar.classList.remove('stick');
        sidebar.style.width = 100 + '%';
        sidebar.style.left = 'auto';
        sidebar.style.position = 'relative';
        sidebar.style.bottom = 'auto';
        sidebar.style.top = 'auto';
      }
    } 
    
  }


  addToCart(product) {
    product.cart_uuid = uuidv4();
    product.selectedPrice = product.information[0].price;
    product.selectedQnt = product.information[0].quantity + product.information[0].um;
    this._cartService.addToCart(product, 1, false);
  }

  getTotalPages() {
    return this.totalPages;
  }

  setTotalPages(page: number) {
    this.totalPages = page;
  }

  setPagesArray(maxPage: number) {
    this.pages = Array(maxPage).fill(0).map((x, i) => i + 1);
  }

  setCurrentPage(page: number) {
    if (this.currentPage <= this.totalPages) {
      this.currentPage = page;
    }
    this.getProducts();
  }

  increaseCurrentPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
    }
    this.getProducts();
  }

  decreaseCurrentPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
    this.getProducts();
  }

  openModal(product) {
    console.log(product)
    const modalRef = this.modalService.open(ProductQuickviewComponent);
    modalRef.componentInstance.productInput = product;
    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
      }
    });
  }

}
