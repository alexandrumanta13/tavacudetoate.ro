import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CartService } from 'src/app/pages/cart/cart.service';
import { ProductsService } from 'src/app/pages/products/products.service';
import { v4 as uuidv4 } from 'uuid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductQuickviewComponent } from '../product-quickview/product-quickview.component';
import { ProductService } from 'src/app/pages/product/product.service';
@Component({
  selector: 'app-products-categories',
  templateUrl: './products-categories.component.html',
  styleUrls: ['./products-categories.component.scss']
})
export class ProductsCategoriesComponent implements OnInit {
  categories: any;
  selectedCategory: string = 'aperitive';
  products: any;
  product: any;
  cartQuantity: any;
  currentRate: any = 4;

  constructor(
    private _route: ActivatedRoute,
    private _ProductsService: ProductsService,
    private _ProductService: ProductService,
    private _cartService: CartService,
    public router: Router,
    public modalService: NgbModal
  ) {

  }

  ngOnInit(): void {

    this._ProductsService.getCategories().then(data => {
      this.categories = data.categories;
    })



    this.getProducts();
  }

  selectCategory(category) {
    this.selectedCategory = category;
    this.getProducts();
  }

  getProducts() {
    if (!this.selectedCategory) {
      this._ProductsService.getProducts('').then(data => {
        this.products = data.products;
        this.getReviews();
      });

    } else {
      this._ProductsService.getProducts(this.selectedCategory).then(data => {
        this.products = data.products;
        this.getReviews();
      });

    }



   
  }

  getReviews() {
    this.products.map((product, i) => {
      this._ProductService.getProductRating(product.id).then(data => {
        this.products[i].currentRate = data.score[0].rating
        this.products[i].reviews = data.count
      })
    })
  }

  addToCart(product) {
    product.cart_uuid = uuidv4();
    product.selectedPrice = product.information[0].price;
    product.selectedQnt = product.information[0].quantity + product.information[0].um;
    this._cartService.addToCart(product, 1, false);
  }

  openModal(product) {
    const modalRef = this.modalService.open(ProductQuickviewComponent);
    modalRef.componentInstance.productInput = product;
    modalRef.result.then((result) => {
      if (result) {

      }
    });
  }
}
