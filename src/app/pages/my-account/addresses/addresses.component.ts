import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthAPIService } from '../../login/auth-api.service';
import { User } from '../../user/user.model';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {

  isAuthentificated = false;
  model: any = {};
  coupons: any;
  addresses: any;
  delete: any = [];
  edit: any = [];
  user: User;
  headers: HttpHeaders;

  constructor(
    private _httpClient: HttpClient,
    private toaster: ToastrService,
    private authAPIService: AuthAPIService,
    public _router: Router
  ) { }

  ngOnInit(): void {

    this.authAPIService.user.subscribe(user => {
      this.isAuthentificated = !!user;
      this.user = user;
      if (this.isAuthentificated) {
        this.headers = new HttpHeaders();
        this.headers = this.headers.set('Authorization', this.user.token);
        this.getAddresses();
      }
    });

  }

  getAddresses() {

    this._httpClient.post<any>(`https://tavacudetoate.ro/tavacudetoate-api/v1/addresses`, { 'id': this.user.id }, { headers: this.headers }).subscribe(addresses => {
      this.addresses = addresses.data;
    })
  }

  deleteAddress(id) {
    this._httpClient.post<any>(`https://tavacudetoate.ro/tavacudetoate-api/v1/address/delete`,
      {
        'id': id,
      }, { headers: this.headers })
      .subscribe(data => {
        if (data.success) {
          this.getAddresses();
          this.toaster.success('', `${data.message}`, {
            timeOut: 3000,
            positionClass: 'toast-bottom-right'
          });
        } else {
          this.toaster.warning('', 'A intervenit o eroare!', {
            timeOut: 3000,
            positionClass: 'toast-bottom-right'
          });
        }

      })
  }

  changeAddress(i, f: NgForm) {


    this._httpClient.post<any>(`https://tavacudetoate.ro/tavacudetoate-api/v1/address/edit`,
      {
        'id': this.addresses[i].id,
        'phone': f.value.phone,
        'address': f.value.address,
        'town': f.value.town_city,
        'county': f.value.county,
      },
      { headers: this.headers })
      .subscribe(data => {
        if (data.success) {
          this.getAddresses();
          this.toaster.success('', `${data.message}`, {
            timeOut: 3000,
            positionClass: 'toast-bottom-right'
          });
        } else {
          this.toaster.warning('', 'A intervenit o eroare!', {
            timeOut: 3000,
            positionClass: 'toast-bottom-right'
          });
        }

      })
  }


  editAddress(i, address) {
    this.edit[i] = !this.edit[i];
    this.model.phone = address.phone;
    this.model.address = address.address;
    this.model.town_city = address.town;
    this.model.county = address.county;
  }



  toggleDelete(i) {
    this.delete[i] = !this.delete[i];
  }

  logout() {
    this.authAPIService.logout();
  }
}
