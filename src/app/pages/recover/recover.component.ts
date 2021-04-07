import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthAPIService } from '../login/auth-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss']
})
export class RecoverComponent implements OnInit {

  model: any = {};
  public _route: string;

  constructor(
    private authService: AuthAPIService,  
    public router: Router,
    private _toaster: ToastrService,
    private _httpClient: HttpClient,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this._route = params.get('token');
    });
  }

  onSubmit() {
    this.authService.recover(this.model.email).then(data => {
      if(data['success']) {
        this._httpClient.post('https://tavacudetoate.ro/data/recoverPassword.php', data['user']).subscribe((data: any) => {
          this._toaster.success('', `${data['message']}`, {
            timeOut: 8000,
            positionClass: 'toast-bottom-right'
          });
        })
        
      } else {
        this._toaster.warning('', `${data['message']}`, {
          timeOut: 8000,
          positionClass: 'toast-bottom-right'
        });
      }
    })
  }

  change() {
    this.authService.changePassword(this.model.password, this._route).then(data => {
      if(data['success']) {
        this._toaster.success('', `${data['message']}`, {
          timeOut: 8000,
          positionClass: 'toast-bottom-right'
        });
        this.router.navigate(['/autentificare'])
      } else {
        this._toaster.warning('', `${data['message']}`, {
          timeOut: 8000,
          positionClass: 'toast-bottom-right'
        });
      }
    })
  }

}
