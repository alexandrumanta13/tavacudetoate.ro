import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  email: string;
  name: string;
  message: string;
  categories: string;
  endpoint: string;

  http: HttpClient;
  model: any = {};

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  terms: any;
  gdpr: any;

  constructor(http: HttpClient, private router: Router,  private toaster: ToastrService,) {
    
    this.http = http;
  }

  ngOnInit() {
    this.endpoint = "https://tavacudetoate.ro/data/sendEmail.php";
  }

  submit(f: NgForm) {

    if (!this.terms) {
      console.log('asdads')
      this.toaster.warning('', 'Trebuie sa fii de acord cu termenii si conditiile site-ului!', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
      return;
    }

    if (!this.gdpr) {
      this.toaster.warning('', 'Trebuie sa fii de acord cu politica de confidentialitate a site-ului!', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
      return;
    }
   
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
