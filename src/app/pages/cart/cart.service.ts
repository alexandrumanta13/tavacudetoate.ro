import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

import { take, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Product } from '../product/product.model';
import { ToastrService } from 'ngx-toastr';


@Injectable({
    providedIn: 'root',
})
export class CartService {

    cartTotal$: number;

    public numTotal = new BehaviorSubject<any>(0);
    public totalPrice = new BehaviorSubject<any>(0);
    public shippingSubject = new BehaviorSubject({});


    constructor(public router: Router, private toaster: ToastrService) {
        let existingCartItems = JSON.parse(localStorage.getItem('tavaProducts'));
        if (!existingCartItems) {
            existingCartItems = [];
        }
        this.itemsSubject.next(existingCartItems);
        this.numTotal.next(existingCartItems.reduce((acc, pr) => acc += pr.num, 0));
        this.totalPrice.next(existingCartItems.reduce((acc, pr) => acc += pr.selectedPrice * pr.num, 0));
    }

    private itemsSubject = new BehaviorSubject<Product[]>([]);

    items$ = this.itemsSubject.asObservable();
    shippingItems$ = this.shippingSubject.asObservable();


    addToCart(product, value, increment) {

        this.items$.pipe(
            take(1),
            map((products) => {

                if (value <= 0) {
                    this.removeFromCart(product);
                    return;
                }

                const filter = {
                    'id': product.id,
                    'selectedQnt': product.selectedQnt,
                };

                const existing = products.filter(function (v, i) {
                    return (v["id"] == product.id && v["selectedQnt"] == product.selectedQnt);
                });



                if (existing.length > 0) {
                    if(existing[0].num > parseInt(value)) {
                        this.toaster.success(`${product.product_name + ' ' + product.selectedQnt}`, 'Produsul fost scos din cos!', {
                            timeOut: 3000,
                            positionClass: 'toast-bottom-right'
                        });
                    } else {
                        this.toaster.success(`${product.product_name + ' ' + product.selectedQnt}`, 'Produsul fost adaugat in cos!', {
                            timeOut: 3000,
                            positionClass: 'toast-bottom-right'
                        });
                    }

                    if (increment) {
                        existing[0].num = parseInt(value);
                    } else {
                        existing[0].num += parseInt(value);
                    }

                    
                } else {
                    products.push({ ...product, num: parseInt(value) });
                    this.toaster.success(`${product.product_name + ' ' + product.selectedQnt}`, 'Produsul fost adaugat in cos!', {
                        timeOut: 3000,
                        positionClass: 'toast-bottom-right'
                    });
                }

                localStorage.setItem('tavaProducts', JSON.stringify(products));
                this.calcTotal();

            }),
        ).subscribe();

    }

    removeFromCart(product: Product) {
        this.items$.pipe(
            take(1),
            map((products) => {
                products = products.filter(({ cart_uuid }) => cart_uuid !== product.cart_uuid);
                localStorage.setItem('tavaProducts', JSON.stringify(products));
                this.calcTotal();
            }),
        ).subscribe();
    }

    emptyCart() {
        localStorage.setItem('tavaProducts', JSON.stringify([]));
        let existingCartItems = JSON.parse(localStorage.getItem('tavaProducts'));
        this.itemsSubject.next(existingCartItems);
        this.numTotal.next(existingCartItems.reduce((acc, pr) => acc += pr.num, 0));
        this.totalPrice.next(existingCartItems.reduce((acc, pr) => acc += pr.selectedPrice * pr.num, 0));
        // this.router.navigate(['/produse']);
    }

    calcTotal() {
        let existingCartItems = JSON.parse(localStorage.getItem('tavaProducts'));
        this.itemsSubject.next(existingCartItems);
        this.numTotal.next(existingCartItems.reduce((acc, pr) => acc += pr.num, 0));
        this.totalPrice.next(existingCartItems.reduce((acc, pr) => acc += pr.selectedPrice * pr.num, 0));
    }

    sendOrder(postVars) {
        this.shippingSubject.next(postVars);
        console.log(this.shippingSubject)
    }


}
