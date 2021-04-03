import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-popup-discount',
  templateUrl: './popup-discount.component.html',
  styleUrls: ['./popup-discount.component.scss']
})
export class PopupDiscountComponent implements OnInit {
  discount: any;
  showPopup: boolean = true;

  constructor(private _httpClient: HttpClient, private toaster: ToastrService) { }

  private SEND_COUPON = "https://tavacudetoate.ro/tavacudetoate-api/v1/coupon/generate"; 
  private SEND_EMAIL = "https://tavacudetoate.ro/data/sendCoupon.php";


  ngOnInit(): void {
    if(this.getData() || this.getData() == 'closed') {
      this.showPopup = false;
    }
  }

  sendDiscount() {
    this._httpClient.post(this.SEND_COUPON, {email: this.discount}).subscribe((data: any) => {
     
      if (data.success === true) {
        this._httpClient.post(this.SEND_EMAIL, {email: this.discount, coupon: data.coupon}).subscribe((data: any) => {
          //console.log(data)
        })
        localStorage.setItem('discount', JSON.stringify(data.coupon));
        this.showPopup = false;
        this.toaster.success('Iti multumim!', `${data.message}`, {
          timeOut: 3000,
          positionClass: 'toast-bottom-right'
        });
      } else {
        this.showPopup = false;
        localStorage.setItem('discount', JSON.stringify({closed: 'closed'}));
        this.toaster.warning('Iti multumim!', `${data.message}`, {
          timeOut: 3000,
          positionClass: 'toast-bottom-right'
        });
      }
    })
  }

  getData() {
    return JSON.parse(localStorage.getItem('discount'));
  }

  hidePopup() {
    //localStorage.setItem('discount', JSON.stringify({closed: 'closed'}));
    this.showPopup = false;
  }

}
