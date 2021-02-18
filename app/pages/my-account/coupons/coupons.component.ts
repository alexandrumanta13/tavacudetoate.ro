import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthAPIService } from '../../login/auth-api.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {

  private USER_COUPONS = "https://tavacudetoate.ro/tavacudetoate-api/v1/coupons";

  isAuthentificated = false;
  model: any = {};
  coupons: any;

  constructor(
    private _httpClient: HttpClient,
    private toaster: ToastrService,
    private authService: AuthAPIService,
    public _router: Router
  ) { }

  ngOnInit(): void {

    this.authService.user.subscribe(user => {
      this.isAuthentificated = !!user;
      if(this.isAuthentificated) {
        this.model.email = user.email;
      } else {
        this._router.navigate(['/autentificare'])
      }
        
    })

    this._httpClient.post(this.USER_COUPONS, { email: this.model.email }).subscribe((data: any) => {
      this.coupons = data.coupons;
    })
  }

  logout() {
    this.authService.logout();
  }

}
