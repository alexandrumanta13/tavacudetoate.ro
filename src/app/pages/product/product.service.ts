import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Product } from './product.model'

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private REST_API_SERVER = "https://tavacudetoate.ro/tavacudetoate-api/v1/";

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */

    constructor(private _httpClient: HttpClient) { }

    /**
     * Get products
     *
     * @returns {Promise<any>}
     */

    public getProduct(productSlug): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get<Product[]>(this.REST_API_SERVER + 'product/' + productSlug)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get category
     *
     * @returns {Promise<any>}
     */

    public getCategory(categorySlug): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get<Product[]>(this.REST_API_SERVER + 'category/' + categorySlug)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get accesories
     *
     * @returns {Promise<any>}
     */

    public getAccesories(): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get<Product[]>(this.REST_API_SERVER + 'accessories')
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

    public getRecomended(categorySlug): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get<Product[]>(this.REST_API_SERVER + 'recommended/category/' + categorySlug)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Add product review
     *
     * @returns {Promise<any>}
     */
    addProductReview(review) : Promise<any>
    {
        return new Promise((resolve, reject) => {
            console.log(review)
            this._httpClient.post(this.REST_API_SERVER + 'review/add', 
            {
                id: review.id, 
                user_name: review.user_name, 
                user_email: review.user_email, 
                user_message: review.user_message,
                ProductID: review.ProductID,
                rating: review.rating
            })
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
       
    }


    /**
     * Get product review
     *
     * @returns {Promise<any>}
     */
    getProductReview(ProductID) : Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.REST_API_SERVER + 'reviews', {ProductID: ProductID})
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
       
    }


    /**
     * Get product rating
     *
     * @returns {Promise<any>}
     */
    getProductRating(ProductID) : Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.REST_API_SERVER + 'review/product', {ProductID: ProductID})
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
       
    }
}
