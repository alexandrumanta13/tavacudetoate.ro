import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLinkActive } from '@angular/router';
import { MyAccountService } from '../my-account.service';
import { AuthAPIService } from '../../login/auth-api.service';
@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  orders: any;
  ordersLink: any;
  @ViewChild(RouterLinkActive) private routerLinkActive: RouterLinkActive;

  
  p: number = 1;
  constructor(
    private myAccountService: MyAccountService, 
    private authService: AuthAPIService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.ordersLink = this.route.snapshot.data['comenzile-mele'];
    this.authService.user.subscribe(user => {
      this.myAccountService.getUserOrders(user.id).then(data => {
        this.orders = data.orders;
      })
    })
  }

  logout() {
    this.authService.logout();
  }

}
