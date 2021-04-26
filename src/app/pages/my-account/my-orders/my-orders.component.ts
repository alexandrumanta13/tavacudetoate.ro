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
  date: any;
  constructor(
    private myAccountService: MyAccountService, 
    private authService: AuthAPIService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.ordersLink = this.route.snapshot.data['comenzile-mele'];
    this.authService.user.subscribe(user => {
      this.myAccountService.getUserOrders(user.id).then(data => {
        this.orders = data.orders;
        
        this.orders.map((order, i) => {
          let date = new Date(this.orders[i].date)
          console.log(date)
          this.orders[i].date = date.setHours( date.getHours() + 3 );
         // this.orders[i].date.setHours( date.getHours() + 3 );
        })
        console.log(this.orders)
      })
    })
  }

  logout() {
    this.authService.logout();
  }

}
