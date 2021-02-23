import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CartService } from 'src/app/pages/cart/cart.service';
import { ProductsService } from 'src/app/pages/products/products.service';
import { v4 as uuidv4 } from 'uuid';
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

  constructor(
    private _route: ActivatedRoute,
    private _ProductsService: ProductsService,
    private _cartService: CartService,
    public router: Router,
  ) { }

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
        console.log(data)
        this.products = data.products;
      });

    } else {
      this._ProductsService.getProducts(this.selectedCategory).then(data => {
        this.products = data.products;
      });

    }

  }

  addToCart(product) {
    product.cart_uuid = uuidv4();
    this._cartService.addToCart(product, 1, false);

  }
}
