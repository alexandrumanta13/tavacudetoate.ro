import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialLoginModule } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

import { AuthAPIService, AuthResponseData } from './auth-api.service';
import { UserService } from '../user/user.service';
import { Observable, Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, take } from 'rxjs/operators';
@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [SocialLoginModule, AuthAPIService, UserService]
})
export class LoginComponent implements OnInit {

  public responseData: any;
  public userPostData = {
    email: '',
    name: '',
    provider: '',
    provider_id: '',
    provider_pic: '',
    token: ''
  };

  public model: any = {};
  public login: any = {};

  authObs: Observable<any>;
  private userSub: Subscription;
  isAuthentificated: boolean;

  constructor(private SocialAuthService: SocialAuthService,
    public authAPIService: AuthAPIService,
    public router: Router,
    public user: UserService,
    private _toaster: ToastrService) {
    //this.user.sessionIn();
  }

  ngOnInit() { 
    this.userSub = this.authAPIService.user.subscribe(user => {
      this.isAuthentificated = !!user;
      if(this.isAuthentificated) {
        this.router.navigate(['/contul-meu']);
      }
    })

  }

  signInWithGoogle(): void {
    this.SocialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(userData => {
      this.apiConnection(userData);
    });;
  }

  signInWithFB(): void {
    this.SocialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(userData => {
      this.apiConnection(userData);
    });;
  }

  signOut(): void {
    this.SocialAuthService.signOut();
  }

  apiConnection(data) {
    
    this.userPostData.email = data.email;
    this.userPostData.name = data.name;
    this.userPostData.provider = data.provider;
    this.userPostData.provider_id = data.id;
    this.userPostData.provider_pic = data.photoUrl;
    this.userPostData.token = data.authToken;

    this.authAPIService.postData(this.userPostData, 'signup').then(
      result => {
        this.responseData = result;
        if (this.responseData.userData) {
          console.log(this.responseData)
          this.user.storeData(this.responseData.userData);
          
          this._toaster.success('', `${data['message']}`, {
            timeOut: 8000,
            positionClass: 'toast-bottom-right'
          });
          window.location.reload();
          setTimeout(() => {
            
            this.router.navigate(['/contul-meu'])
          }, 2000)
          
        }
      },
      err => {
        this._toaster.warning('', `${data['message']}`, {
          timeOut: 8000,
          positionClass: 'toast-bottom-right'
        });
        console.log('error');
      }
    );
  }

  onSubmit(form: NgForm) {
    if(!form.valid) {
      return;
    }
   
    const email = form.value.email;
    const password = form.value.password;

   

    let authObs: Observable<AuthResponseData>;

    authObs = this.authAPIService.login(this.login.email, this.login.password);

    authObs.subscribe(data => {

      if(data['success']) {
        this._toaster.success('', `${data['message']}`, {
          timeOut: 8000,
          positionClass: 'toast-bottom-right'
        });
        window.location.reload();
        setTimeout(() => {
          
          this.router.navigate(['/contul-meu'])
        }, 2000)
        
       
      } else {
        this._toaster.warning('', `${data['message']}`, {
          timeOut: 8000,
          positionClass: 'toast-bottom-right'
        });
        form.reset();
      }

    }, error => {
      console.log(error)
    });

  }

  signup() {
    this.authAPIService.signup(this.model).subscribe(data => {
      if(data['success']) {
        this._toaster.success('', `${data['message']}`, {
          timeOut: 8000,
          positionClass: 'toast-bottom-right'
        });
      } else {
        this._toaster.warning('', `${data['message']}`, {
          timeOut: 8000,
          positionClass: 'toast-bottom-right'
        });
      }
      
    })
  }
  
}
