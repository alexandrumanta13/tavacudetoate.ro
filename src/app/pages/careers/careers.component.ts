import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.scss']
})
export class CareersComponent implements OnInit {
  careers: any;
  email: string;
  name: string;
  message: string;
  categories: string;
  endpoint: string;
  model: any = {};
  terms: any;
  gdpr: any;
  disabled: boolean = false;
  datasheet: string;

  constructor(private _httpClient: HttpClient, private router: Router, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getCareers();
    this.endpoint = "https://tavacudetoate.ro/data/sendCareers.php";
  }

  getCareers() {
    this._httpClient.get('https://tavacudetoate.ro/tavacudetoate-api/v1/careers').subscribe((data: any) => {
      this.careers = data;
    });
  }


  selectCareer(career) {
    this.model.subject = 'Aplica pentru ' + career;
  }


  fileChange(event) {
    let fileList: FileList = event.target.files;
    this.disabled = true;

    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      let options = { headers: headers };

      this.uploadDatasheet(formData, options)
        .then(datasheet => {
          this.datasheet = 'https://www.tavacudetoate.ro/upload/datasheets/' + datasheet.file;
          this.disabled = false;
        })

    }

  }

  uploadDatasheet(formData, options): Promise<any> {

    return new Promise((resolve, reject) => {
      this._httpClient.post('https://www.tavacudetoate.ro/upload/upload-datasheet.php', formData, options)
        .pipe(map(res => res))
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });

  }

  submit(f: NgForm) {

    if (!this.terms) {
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
      cv: this.datasheet,
    };


    

    this._httpClient.post(this.endpoint, postVars)
      .subscribe(
        response => {
          let modal: HTMLElement = document.querySelector('.close') as HTMLElement;
          modal.click()
          f.reset();
          if (!this.terms) {
            this.toaster.success('Iti multumim!', 'Am primit cererea ta, iti vom raspunde in cel mai scurt timp!', {
              timeOut: 3000,
              positionClass: 'toast-bottom-right'
            });
            return;
          }
        }

      )

  }

}
