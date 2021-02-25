import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './cart.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

export class CartComponent implements OnInit {
  

  constructor(
    public router: Router,
    private cartService: CartService
    ) { }

    public items$ = this.cartService.items$;
    public products;
    public totalPrice$;

  ngOnInit(): void {
    this.items$.subscribe(data => {
      this.products = data;
    })

    this.cartService.totalPrice.subscribe(info => {
      this.totalPrice$ = info;
    });

  }

  emptyCart() {
    this.cartService.emptyCart();
  }

  addToCart(product, event, isBlur: boolean = false) {
    if(isBlur) {
      this.cartService.addToCart(product, event.target.value, true);
    } else {
      this.cartService.addToCart(product, event, false);
    }
  }

  addOneToCart(product) {
    this.cartService.addToCart(product, product.num + 1, true);
  }

  removeOneFromCart(product) {
    this.cartService.addToCart(product, product.num - 1, true);
  }
  removeFromCart(product) {
    this.cartService.removeFromCart(product);
  }
  
}
