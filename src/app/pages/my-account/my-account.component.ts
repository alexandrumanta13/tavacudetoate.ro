import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthAPIService } from '../login/auth-api.service';
import { MyAccountService } from './my-account.service';
import { ToastrService } from 'ngx-toastr';
import { from, Subscription } from 'rxjs';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  isAuthentificated = false;
  private userSub: Subscription;
  model: any = {};
  changePass: boolean = false;


  constructor(
    private authService: AuthAPIService,
    private myAccountService: MyAccountService,
    private toaster: ToastrService,
    public router: Router
  ) { }

  ngOnInit(): void {
     
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthentificated = !!user;
      if(this.isAuthentificated) {
        this.model.id = user.id;
        this.model.name = user.name;
        this.model.last_name = user.last_name;
        this.model.email = user.email;
      } else {
        this.router.navigate(['/autentificare'])
      }
        
    })
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onSubmit() {
    
    this.myAccountService.updateUser(this.model).then(data => {
      if (data.success === true) {
        this.toaster.success('Te rugam sa te autentifici din nou!', `${data.message}`, {
          timeOut: 3000,
          positionClass: 'toast-bottom-right'
        });
        
        localStorage.setItem('TavaUserData', JSON.stringify(data.user));
        
      }
      if (data.success === false) {

        this.toaster.warning('', `${data.message}`, {
          timeOut: 3000,
          positionClass: 'toast-bottom-right'
        });
        return;
      }
      
    });
  }

  changePassAction() {
    this.changePass = !this.changePass;
  }

  
  logout() {
    this.authService.logout();
  }
}
