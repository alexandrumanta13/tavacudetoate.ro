import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/pages/cart/cart.service';
import { ProductService } from 'src/app/pages/product/product.service';

@Component({
  selector: 'app-product-quickview',
  templateUrl: './product-quickview.component.html',
  styleUrls: ['./product-quickview.component.scss']
})
export class ProductQuickviewComponent implements OnInit {
  product: any;
  productCategoryName: any;
  productCategorySlug: any;
  price: number;
  productImages: any;

  constructor(
    private _route: ActivatedRoute,
    private _ProductService: ProductService,
    private _cartService: CartService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    
  }


  
  getProduct(slug) {
    console.group(slug)
    this._ProductService.getProduct(slug).then(data => {
      this.product = data;
     
      this.productCategoryName = this.product.categories[0].category_name;
      this.productCategorySlug = this.product.categories[0].slug;
      this.price = parseInt(this.product.information[0].price);
    
      this.product.selectedQnt = this.product.information[0].quantity + this.product.information[0].um;
      // this.product.images.map(productImage => {
      //   this.productImages.push({ src: '/assets/images/resource/shop/' + productImage.image_url, thumb: '/assets/images/resource/shop/' + productImage.image_url })
      // })
      // console.log(this.productImages)
      console.log(this.product)
    });
  }
}
