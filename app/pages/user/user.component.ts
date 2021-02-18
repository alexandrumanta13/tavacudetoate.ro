import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { SocialAuthService } from "angularx-social-login";

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public data: any;
  public userData: any;
  
  constructor(
  public user: UserService,
  public socialAuthService: SocialAuthService,
  public route: ActivatedRoute
  ) {
  this.userData = this.user.getData();
  }
  
  ngOnInit() {
     this.user.sessionOut();
  }
  
  logout() {
     this.socialAuthService.signOut().then(data => {
     this.user.logOut();
  });
  }

}
