import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { ProductService } from './product.service';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { Lightbox } from 'ngx-lightbox';

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
    private _lightbox: Lightbox
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      activeEndDate: new FormControl(new Date(), { validators: [Validators.required, DateTimeValidator] })
    }, { updateOn: 'change' });

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
      this.price = parseInt(this.product.information[0].price);
      this.portions = this.product.information[0].portions;
      this.isActive = this.product.information[0].id;
      this.product.selectedQnt = this.product.information[0].quantity + this.product.information[0].um;
      this.product.composition = "";
      this.product.message = "";
      this.product.images.map(productImage => {
        this.productImages.push({ src: '/assets/images/resource/shop/' + productImage.image_url, thumb: '/assets/images/resource/shop/' + productImage.image_url })
      })
      console.log(this.productImages)

    });

    this._ProductService.getAccesories().then(data => {
      this.accessories = data;
    });


    this._ProductService.getRecomended(this._categoryRoute).then(data => {
      this.recommended = data.products;
    });
  }

  addDeliveryDate(date) {



    this.product.deliverydate = `${date.datetime.day + '.' + date.datetime.month + '.' + date.datetime.year}`;
    this.product.interval = date.interval;
  }

  addToCart(product) {

    this.product.selectedPrice = this.price;
    if(this.message) {
      this.product.message = this.message;
    }
    
    product.cart_uuid = uuidv4();
    this._cartService.addToCart(product, this.cartQuantity, false);

  }

  selectQnt(qnt) {
    this.isActive = qnt.id;
    this.price = parseInt(qnt.price);
    this.portions = qnt.portions;
    this.product.selectedQnt = qnt.quantity + qnt.um;
  }

  addAccessory(event, product, accessory) {

    const existing = product.accessories.findIndex(obj => obj.id === accessory.id);
    if (existing > -1) {
      product.accessories = product.accessories.filter(item => item.id !== accessory.id);
      this.price -= 10;
    } else {
      product.accessories.push(accessory);
      this.product.selectedAccessories += accessory.accessory_name + ', '
      this.price += 10;
    }

    event.target.classList.toggle('active');
  }

  ngAfterViewInit() {

    //LightBox / Fancybox
    if ($('.lightbox-image').length) {
      $('.lightbox-image').fancybox({
        openEffect: 'fade',
        closeEffect: 'fade',
        helpers: {
          media: {}
        }
      });

    }

    
    //LightBox / Fancybox
    // if ($('.lightbox-image').length) {
    //   $('.lightbox-image').fancybox({
    //     openEffect: 'fade',
    //     closeEffect: 'fade',
    //     helpers: {
    //       media: {}
    //     }
    //   });
    // }

    // $('.product-details-content .bxslider').bxSlider({
    //   nextSelector: '.product-details-content #slider-next',
    //   prevSelector: '.product-details-content #slider-prev',
    //   nextText: '<i class="fa fa-angle-right"></i>',
    //   prevText: '<i class="fa fa-angle-left"></i>',
    //   mode: 'fade',
    //   auto: 'true',
    //   speed: '700',
    //   pagerCustom: '.product-details-content .slider-pager .thumb-box'
    // });

    // $('.tabs-box .tab-buttons .tab-btn').on('click', function (e) {
    //   e.preventDefault();
    //   var target = $($(this).attr('data-tab'));

    //   if ($(target).is(':visible')) {
    //     return false;
    //   } else {
    //     target.parents('.tabs-box').find('.tab-buttons').find('.tab-btn').removeClass('active-btn');
    //     $(this).addClass('active-btn');
    //     target.parents('.tabs-box').find('.tabs-content').find('.tab').fadeOut(0);
    //     target.parents('.tabs-box').find('.tabs-content').find('.tab').removeClass('active-tab');
    //     $(target).fadeIn(300);
    //     $(target).addClass('active-tab');
    //   }
    // });
  }

  open(index: number): void {
    // open lightbox
    this._lightbox.open(this.productImages, index);
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }


  chooseComposition() {
    this.product.composition = this.composition;
  }


  descriptionTab(activeTab){
    this.activeTab = activeTab;
  }

  infoDelivery(activeTab){
    this.activeTab = activeTab;
  }


}

export const DateTimeValidator = (fc: FormControl) => {
  const date = new Date(fc.value);
  const isValid = !isNaN(date.valueOf());
  return isValid ? null : {
    isValid: {
      valid: false
    }
  };
};
