import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProductsService } from './products.service';
import { Product } from '../product/product.model'
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { CartService } from '../cart/cart.service';
import { v4 as uuidv4 } from 'uuid';



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
      this._ProductsService.getProducts('', this.currentPage).then(data => {
        console.log(data)
        this.totalNoOfProducts = data.total_no_of_products;
        this.products = data.products;

        this.setTotalPages(data.no_of_pages);
        this.setPagesArray(this.totalPages);
      });

      this.moveToTop();

    } else {
      this._ProductsService.getProducts(this._categoryRoute, this.currentPage).then(data => {
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


  addToCart(product) {
    product.cart_uuid = uuidv4();
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

}
