import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductQuickviewComponent } from 'src/app/components/layout/product-quickview/product-quickview.component';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-chefs-suggestion',
  templateUrl: './chefs-suggestion.component.html',
  styleUrls: ['./chefs-suggestion.component.scss']
})
export class ChefsSuggestionComponent implements OnInit {

  public products: any;
  menus: any;

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
    public modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getProducts();
    
  }


  ngAfterViewInit() {
    

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.getProducts();
    });
  }

  getProducts() {
    this._ProductsService.getChefsProducts().then(data => {
      this.menus = data;
    });

    this.moveToTop();
  }

  moveToTop() {
    const scrollToContainer = document.querySelector('.shop-page-section');
    if (window.innerWidth > 991 && scrollToContainer) {
      scrollToContainer.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

    }
  }




  addToCart(product) {
    product.cart_uuid = uuidv4();
    product.selectedPrice = product.information[0].price;
    product.selectedQnt = product.information[0].quantity + product.information[0].um;
    this._cartService.addToCart(product, 1, false);
  }

  addMenuToCart(products) {
    products.map(product => {
      product.cart_uuid = uuidv4();
      product.selectedPrice = product.information[0].price;
      product.selectedQnt = product.information[0].quantity + product.information[0].um;
      this._cartService.addToCart(product, 1, false);
    })
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
