import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ProductsService } from 'src/app/pages/products/products.service';
import { CartService } from '../../../pages/cart/cart.service';



@Component({
  selector: 'app-promotion-section',
  templateUrl: './promotion-section.component.html',
  styleUrls: ['./promotion-section.component.scss']
})
export class PromotionSectionComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    nav: true,
    autoplay: false,
    autoplayTimeout: 5000,
    navText: ['<i class="ion-ios-arrow-back"></i>', '<i class="ion-ios-arrow-forward"></i>'],
    // margin: 30,
    
    responsive: {
      0: {
        items: 1
      },
      576: {
        items: 2
      },
      768: {
        items: 2
      },
      992: {
        items: 3
      },
      1200: {
        items: 3
      }
    }
  }

  products: any;

  constructor(
    private _cartService: CartService,
    private _ProductsService: ProductsService,
  ) { }



  ngOnInit(): void {
    this._ProductsService.getProductsPopular().then(data => {
      console.log(data)
      this.products = data;
    });
  }

  addToCart(product) {
    this._cartService.addToCart(product, 1, false);
  }

}
