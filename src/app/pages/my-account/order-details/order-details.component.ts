import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthAPIService } from '../../login/auth-api.service';
import { MyAccountService } from '../my-account.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  order: any;

  constructor(private myAccountService: MyAccountService, private _route: ActivatedRoute, public router: Router,  public authAPIService: AuthAPIService,) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.myAccountService.getUserOrder(params.get('orderUUID')).then(data => {
        this.order = data[0];
      })
    });
  }

  logout() {
    this.authAPIService.logout();
  }
}
