
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { User } from '../user/user.model';

import { AuthAPIService } from './auth-api.service';

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthAPIService
    ) { }




    // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //     if (localStorage.getItem('LaPetiteUserData')) {
    //         // logged in so return true
    //         return true;
    //     }

    //     // not logged in so redirect to login page with the return url and return false
    //     this.router.navigate(['autentificare'], { queryParams: { returnUrl: state.url }});
    //     return false;
    // }

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): | boolean  | UrlTree  | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
       
        return this.authService.user.pipe(
            take(1),
            map(user => {
                const isAuth = !!user;
                if (isAuth) {
                  return true;
                }
                return this.router.createUrlTree(['/autentificare']);
        })
       
        // tap(isAuth => {
           
        //     if(!isAuth) {
        //         console.log('asdadsa1')
        //         return this.router.createUrlTree['/autentificare']
        //     } else {
        //         console.log(isAuth)
        //         this.router.createUrlTree['/autentificare']
        //         return true;
        //     }
        // })
    )
    }

    // canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    //     if (!this.authService.isAuthorized()) {
    //         return false;
    //     }

    //     const roles = route.data && route.data.roles as Role[];
    //     if (roles && !roles.some(r => this.authService.hasRole(r))) {
    //         return false;
    //     }

    //     return true;
    // }
}
