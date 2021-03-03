import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ProductService } from 'src/app/pages/product/product.service';
import { ProductsService } from 'src/app/pages/products/products.service';
import { CartService } from '../../../pages/cart/cart.service';



@Component({
  selector: 'app-promotion-section',
  templateUrl: './promotion-section.component.html',
  styleUrls: ['./promotion-section.component.scss']
})
export class PromotionSectionComponent implements OnInit {

  product: any;
  productCategoryName: any;
  productCategorySlug: any;
  price: number;
  productImages: any;
  isActive: any;
  portions: any;

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
    private _ProductService: ProductService,
  ) { }



  ngOnInit(): void {
    this._ProductsService.getProductsPopular().then(data => {
      console.log(data)
      this.products = data;
    });
  }

  addToCart(product) {
    product.selectedPrice = product.information[0].price;
    product.selectedQnt = product.information[0].quantity + product.information[0].um;
    this._cartService.addToCart(product, 1, false);
  }


  getProduct(slug) {
   
    this._ProductService.getProduct(slug).then(data => {
      this.product = "";
      this.product = data;

      console.log(this.product)
      
      this.productCategoryName = this.product.categories[0].category_name;
      this.productCategorySlug = this.product.categories[0].slug;
      this.price = this.product.information[0].price;
      this.isActive = this.product.information[0].id;
      this.product.selectedQnt = this.product.information[0].quantity + this.product.information[0].um;
      // this.product.images.map(productImage => {
      //   this.productImages.push({ src: '/assets/images/resource/shop/' + productImage.image_url, thumb: '/assets/images/resource/shop/' + productImage.image_url })
      // })
      // console.log(this.productImages)

    });
  }

  

  selectQnt(qnt) {
    this.isActive = qnt.id;
    this.price = qnt.price;
    this.portions = qnt.portions;
    this.product.selectedQnt = qnt.quantity + qnt.um;
    console.log(qnt)
  }

}
