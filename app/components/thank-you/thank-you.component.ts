import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {


  email: string;
  name: string;
  message: string;
  categories: string;
  endpoint: string;

  http: HttpClient;
  model: any = {};

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(http: HttpClient, private router: Router, private toaster: ToastrService,) {

    this.http = http;
  }

  ngOnInit() {
    this.endpoint = "https://tavacudetoate.ro/data/sendEmail.php";
    setTimeout(() => {
      this.toaster.success('Iti multumim!', 'Mesajul tau a fost trimis. Iti raspundem de indata ce il citim.', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
    }, 2000);
  }

  submit(f: NgForm) {

    let postVars = {
      email: this.model.email,
      name: this.model.name,
      phone: this.model.phone,
      subject: this.model.subject,
      message: this.model.message,
    };


    console.log(postVars)

    this.http.post(this.endpoint, postVars)
      .subscribe(
        response => {
          f.reset();
          this.router.navigate(['/mesaj-trimis']);
        }

      )

  }

}