import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { ProductService } from './product.service';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { Lightbox } from 'ngx-lightbox';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductQuickviewComponent } from 'src/app/components/layout/product-quickview/product-quickview.component';
import { HttpClient } from '@angular/common/http';




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
  activeTab: any = "prod";
  currentRate: any = 0;
  addRate = 5;
  public model: any = {};
  reviews: any;

  private SEND_REVIEW = "https://tavacudetoate.ro/data/sendReview.php";
  selectedQnt: any;
  addedReview: boolean = false;
  countReviews: any = 0;


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
    public modalService: NgbModal,
    private _toaster: ToastrService,
    private _httpClient: HttpClient,
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
      this.selectedQnt = this.product.information[0].quantity + this.product.information[0].um;
      this.isActive = this.product.information[0].id;
      this.product.selectedQnt = this.product.information[0].quantity + this.product.information[0].um;
      this.getReviews();
    });

    this._ProductService.getRecomended(this._categoryRoute).then(data => {
      this.recommended = data.products;
    });

   
  }


  getReviews() {
    this._ProductService.getProductReview(this.product.id).then(data => {
      this.reviews = data;

    })
    this._ProductService.getProductRating(this.product.id).then(data => {
      this.currentRate = data.score[0].rating
      this.countReviews = data.count;
    })
    
  }

  changeimage(image: string) {
    this.selectedImage = image;
  }


  // addToCart(product) {

  //   this.product.selectedPrice = this.price;
  //   product.cart_uuid = uuidv4();
  //   this._cartService.addToCart(product, this.cartQuantity, false);

  // }

  addToCart(product, event, isBlur: boolean = false) {
    product.cart_uuid = uuidv4();
    product.selectedPrice = this.price;
    product.selectedQnt = this.selectedQnt;
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

  selectQnt(qnt) {
    this.isActive = qnt.id;
    this.price = qnt.price;
    this.product.selectedQnt = qnt.quantity + qnt.um;
    this.selectedQnt = qnt.quantity + qnt.um;
  }



  ngAfterViewInit() {

  }

  descriptionTab(activeTab) {
    this.activeTab = activeTab;
  }

  infoDelivery(activeTab) {
    this.activeTab = activeTab;
  }

  openModal(product) {
    
    const modalRef = this.modalService.open(ProductQuickviewComponent);
    modalRef.componentInstance.productInput = product;
    modalRef.result.then((result) => {
      if (result) {
        
      }
    });
  }
  scrollToReviews() {
    try {
      document.querySelector('#reviews').scrollIntoView();
    } catch (e) { }
  }
  


  onSubmit(form: NgForm) {
    
    this.model.id =  uuidv4();
    this.model.rating = this.addRate;
    this.model.ProductID = this.product.id;
    this.model.product_name = this.product.product_name;
    
    this._ProductService.addProductReview(this.model).then(data => {
      if (data.success) {
        
        this.model.review_id = data.review.id;
        this.model.user_email = data.review.user_email;
        
        this._httpClient.post(this.SEND_REVIEW, this.model).subscribe((data: any) => {
          if (data.success) {
            this._toaster.success('Multumim!', `${data['message']}`, {
              timeOut: 8000,
              positionClass: 'toast-bottom-right'
            });
            this.getReviews();
            this.addedReview = true;
            form.reset();
          }

        })
      } else {
        this._toaster.success('Te rugam sa incerci din nou', 'A aparut o eroare', {
          timeOut: 8000,
          positionClass: 'toast-bottom-right'
        })
      }
    });
  }

  changeTab(activeTab){
    this.activeTab = activeTab;
  }
}

