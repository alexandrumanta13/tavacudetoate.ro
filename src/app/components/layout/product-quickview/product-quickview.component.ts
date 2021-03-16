import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BehaviorSubject } from 'rxjs';
import { CartService } from 'src/app/pages/cart/cart.service';
import { Product } from 'src/app/pages/product/product.model';
import { v4 as uuidv4 } from 'uuid';
import { ProductService } from 'src/app/pages/product/product.service';

@Component({
  selector: 'app-product-quickview',
  templateUrl: './product-quickview.component.html',
  styleUrls: ['./product-quickview.component.scss']
})
export class ProductQuickviewComponent implements OnInit {

  @Input() public productInput;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  
  product: any;
  productCategoryName: any;
  productCategorySlug: any;
  price: number;
  productImages: any;
  isActive: any;
  portions: any;

  customOptions: OwlOptions = {
    items: 1, dots: false, margin: 0, stagePadding: 0
    
  }

  dotsOptions: OwlOptions;
  selectedImage: string;
  cartQuantity: number = 1;

  

  constructor(
    private _route: ActivatedRoute,
    private _ProductService: ProductService,
    private _cartService: CartService,
    public router: Router,
    public activeModal: NgbActiveModal
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

   }

  
  ngOnInit(): void {
    console.log(this.productInput)
    this.getProduct();
  }


  
  getProduct() {
   
    this._ProductService.getProduct(this.productInput.alias).then(data => {
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

  changeimage(image: string) {
    this.selectedImage = image;
  }

  addToCart(product, event, isBlur: boolean = false) {
    this.product.selectedPrice = this.price;
    if(isBlur) {
      this._cartService.addToCart(product, this.cartQuantity, true);
    } else {
      this._cartService.addToCart(product, this.cartQuantity, false);
    }
  }

  addOneToCart(product) {
    // this.product.selectedPrice = this.price;
    this.cartQuantity += 1;
    // this._cartService.addToCart(product, this.cartQuantity, true);
  }

  removeOneFromCart(product) {
    if(this.cartQuantity === 1) {
      return;
    }
    // this.product.selectedPrice = this.price;
    this.cartQuantity -= 1;
    // this._cartService.addToCart(product, this.cartQuantity, true);
  }

 
}
