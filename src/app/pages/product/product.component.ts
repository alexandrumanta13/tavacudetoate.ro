import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { ProductService } from './product.service';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { Lightbox } from 'ngx-lightbox';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductQuickviewComponent } from 'src/app/components/layout/product-quickview/product-quickview.component';

declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  formGroup: FormGroup;
  dateModel: Date = new Date();

  stringDateModel: string = new Date().toString();
  private _categoryRoute: string;
  private _productRoute: string;
  product: any;
  productCategoryName: any;
  productCategorySlug: any;
  price: number;
  portions: any;
  isActive: number;
  accessories: any;
  cartQuantity: number = 1;
  recommended: any;
  message: string = "";
  composition: string = "";

  productImages = [];
  activeTab: any = "description";


  /**
   * Constructor
   *
   * @param {ProductService} _ProductService
   * @param {ActivatedRoute} _route
   * @param {Router} router
   * @param {CartService} _cartService
   * 
   */

  constructor(
    private _route: ActivatedRoute,
    private _ProductService: ProductService,
    private _cartService: CartService,
    public router: Router,
    private toaster: ToastrService,
    private _lightbox: Lightbox,
    public modalService: NgbModal
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  customOptions: OwlOptions = {
    items: 1, dots: false, margin: 0, stagePadding: 0, autoWidth: true, autoHeight: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
  }

  dotsOptions: OwlOptions;
  selectedImage: string;

  ngOnInit(): void {
    
    this._route.paramMap.subscribe(params => {
      this._categoryRoute = params.get('categorySlug');
      this._productRoute = params.get('productSlug');
    });

    this._ProductService.getProduct(this._productRoute).then(data => {
      this.product = data;
      this.product.accessories = [];
      this.product.selectedAccessories = '';
      this.productCategoryName = this.product.categories[0].category_name;
      this.productCategorySlug = this.product.categories[0].slug;
      this.price = this.product.information[0].price;
      this.isActive = this.product.information[0].id;
      this.product.selectedQnt = this.product.information[0].quantity + this.product.information[0].um;
    });

    this._ProductService.getRecomended(this._categoryRoute).then(data => {
      this.recommended = data.products;
    });
  }

  changeimage(image: string) {
    this.selectedImage = image;
  }


  addToCart(product) {

    this.product.selectedPrice = this.price;
    product.cart_uuid = uuidv4();
    this._cartService.addToCart(product, this.cartQuantity, false);

  }

  selectQnt(qnt) {
    this.isActive = qnt.id;
    this.price = qnt.price;
    this.product.selectedQnt = qnt.quantity + qnt.um;
  }

  

  ngAfterViewInit() {    
   
  }

  descriptionTab(activeTab){
    this.activeTab = activeTab;
  }

  infoDelivery(activeTab){
    this.activeTab = activeTab;
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

