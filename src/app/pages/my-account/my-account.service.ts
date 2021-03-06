import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})
export class MyAccountService {

    private REST_API_SERVER = "https://tavacudetoate.ro/tavacudetoate-api/v1/";

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */

    constructor(private _httpClient: HttpClient) { }

    /**
     * Update User
     *
     * @returns {Promise<any>}
     */

    public updateUser(user): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.post(this.REST_API_SERVER + 'user/update', 
            {
                'id': user.id, 
                'firstName': user.name, 
                'lastName': user.last_name,
                'email': user.email,
                'password': user.password
            })
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get user orders
     *
     * @returns {Promise<any>}
     */

    public getUserOrders(userID, token): Promise<any> {
        return new Promise((resolve, reject) => {
            let headers = new HttpHeaders();
            
            headers = headers.set('Authorization', token);
            this._httpClient.post(this.REST_API_SERVER + 'customer/orders', {'id': userID}, {headers: headers})
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get user order
     *
     * @returns {Promise<any>}
     */

    public getUserOrder(orderUUID, token): Promise<any> {

        return new Promise((resolve, reject) => {
            let headers = new HttpHeaders();
            headers = headers.set('Authorization', token);
            
            this._httpClient.post(this.REST_API_SERVER + 'order' , {'id': orderUUID}, {headers: headers})
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    
    /**
     * Get remommended
     *
     * @returns {Promise<any>}
     */

    // public getRecomended(categorySlug): Promise<any> {

    //     return new Promise((resolve, reject) => {
    //         this._httpClient.get<Product[]>(this.REST_API_SERVER + 'recommended/category/' + categorySlug)
    //             .subscribe((response: any) => {
    //                 resolve(response);
    //             }, reject);
    //     });
    // }
}
