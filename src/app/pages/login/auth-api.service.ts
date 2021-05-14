import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User } from '../user/user.model';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';


export interface AuthResponseData {
  user: User
}

@Injectable({ providedIn: 'root' })
export class AuthAPIService {
  private API_LOGIN = "https://tavacudetoate.ro/tavacudetoate-api/v1/";

  user = new BehaviorSubject<User>(null);

  private tokenExpirationTimer: any;

  constructor(private _httpClient: HttpClient, public _router: Router) {
    
    this.user = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('TavaUserData')));
    
  }

  public postData(credentials, type): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders();
      this._httpClient.post(this.API_LOGIN + type, JSON.stringify(credentials))
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  // public signup(user): Promise<any> {
  //   console.log(user)
  //   return new Promise((resolve, reject) => {
  //     const headers = new HttpHeaders();
  //     this._httpClient.post(`https://tavacudetoate.ro/tavacudetoate-api/v1/register`, {  "firstName": user.name, "lastName": user.last_name, "email": user.email, "password": user.password })
  //       .subscribe((data: any) => {
          
  //         resolve(data);
  //       }, reject);
  //   });
  // }

  signup(user) {
    return this._httpClient.post<AuthResponseData>(`https://tavacudetoate.ro/tavacudetoate-api/v1/register`, {  "firstName": user.name, "lastName": user.last_name, "email": user.email, "password": user.password })
      .pipe(tap(data => {
        this.handleAuthentication(
          data.user.id,
          data.user.name,
          data.user.last_name,
          data.user.email,
          data.user.provider,
          data.user.provider_id,
          data.user.provider_pic,
          data.user.date_last_visit,
          data.user.access,
          data.user.token
        );
      })
      );
  }



  login(email: string, password: string) {
    
    return this._httpClient.post<AuthResponseData>(this.API_LOGIN + 'login', { email: email,  password: password })
      .pipe(
        tap(data => {
        console.log(data)
          if(data['success']) {
            this.handleAuthentication(
              data.user.id,
              data.user.name,
              data.user.last_name,
              data.user.email,
              data.user.provider,
              data.user.provider_id,
              data.user.provider_pic,
              data.user.date_last_visit,
              data.user.access,
              data.user.token,
            );
          }
          
        })
      )
  }

  logout() {
    this.user.next(null);
    this._router.navigate(['/autentificare']);
    localStorage.removeItem('TavaUserData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {

    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  autoLogin() {
    const TavaUserData: {
      id: number,
      name: string,
      last_name: string,
      email: string,
      provider: string,
      provider_id: string,
      provider_pic: string,
      date_last_visit: Date,
      access: number,
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('TavaUserData'));
    if (!TavaUserData) {
      return;
    }

    const loadedUser = new User(
      TavaUserData.id,
      TavaUserData.name,
      TavaUserData.last_name,
      TavaUserData.email,
      TavaUserData.provider,
      TavaUserData.provider_id,
      TavaUserData.provider_pic,
      TavaUserData.date_last_visit,
      TavaUserData.access,
      TavaUserData._token,
      new Date(TavaUserData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(TavaUserData._tokenExpirationDate).getTime() -
        new Date().getTime();
      //this.autoLogout(expirationDuration);

    }
  }

  recover(email) {
    return new Promise((resolve, reject) => {

      this._httpClient.post(this.API_LOGIN + 'recover', {'email': email} )
        .subscribe((response: any) => {
          resolve(response);
        }, reject);

    });
  }

  changePassword(password, token) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', token);
      this._httpClient.post(this.API_LOGIN +  'changePassword', {'password': password}, {headers: headers} )
        .subscribe((response: any) => {
          resolve(response);
        }, reject);

    });
  }

  private handleAuthentication(
    id: number,
    name: string,
    last_name: string,
    email: string,
    provider: string,
    provider_id: string,
    provider_pic: string,
    date_last_visit: Date,
    access: number,
    token: string,

  ) {
    const expirationDate = new Date(date_last_visit);
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    const user = new User(
      id,
      name,
      last_name,
      email,
      provider,
      provider_id,
      provider_pic,
      date_last_visit,
      access,
      token,
      expirationDate
    )


    localStorage.setItem('TavaUserData', JSON.stringify(user))
    this.user.next(user);
    
    //this.autoLogout(expirationDate.getTime());

    
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!';
    if(!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage)
    }
    switch(errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already!'
    }
    return throwError(errorMessage)
  }
}