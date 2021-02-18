import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthAPIService } from './auth-api.service';
import { exhaustMap, take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthAPIService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        return this.authService.user.pipe(
            take(1),
            exhaustMap(user => {
                // if (user && user.token) {
                //     request = request.clone({
                //         setHeaders: { 
                //             Authorization: `Bearer ${user.token}`
                //         }
                //     });
                // }
                if(!user) {
                    return next.handle(request);
                }
                const modifiedReq = request.clone({
                    params: new HttpParams().set('auth', user.token)
                })
                return next.handle(modifiedReq);
            }));
        

        
    }
}