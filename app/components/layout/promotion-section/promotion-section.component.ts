import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ProductsService } from 'src/app/pages/products/products.service';
import { CartService } from '../../../pages/cart/cart.service';



@Component({
  selector: 'app-promotion-section',
  templateUrl: './promotion-section.component.html',
  styleUrls: ['./promotion-section.component.scss']
})
export class PromotionSectionComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    margin: 30,
    nav: true,
    smartSpeed: 3000,
    autoplay: true,
    navText: ['<span class="icon-Arrow-Left"></span>', '<span class="icon-Arrow-Right"></span>'],
    responsive: {
      0: {
        items: 1
      },
      480: {
        items: 1
      },
      600: {
        items: 1
      },
      800: {
        items: 1
      },
      1200: {
        items: 1
      }

    }
  }

  products: any;

  constructor(
    private _cartService: CartService,
    private _ProductsService: ProductsService,
  ) { }



  ngOnInit(): void {
    this._ProductsService.getProductsLimited().then(data => {
      console.log(data.products)
      this.products = data.products;
    });    
    // this.products = [
    //   {
    //     item:
    //     {
    //       "product_name": "Cozonac Traditional",
    //       "title": "Cozonac Traditional",
    //       "description": "Ce ar fi masa de sarbatoare fara un cozonac dolofan, care se topeste in gura, fraged si plin de nuca delicioasa?",
    //       "price": "65",
    //       "image": "cozonac-traditional.jpg"
    //     },
    //     forCart:
    //     {
    //       "id": "56",
    //       "product_name": "Cozonac Traditional",
    //       "alias": "cozonac-traditional",
    //       "CategoryID": "6",
    //       "description": "",
    //       "ingredients": "Faina, lapte, oua,unt,  aroma rom, aroma vanilie, coaja citrice, cacao, miez de nuca",
    //       "images": [
    //         {
    //           "image_url": "cozonac-traditional-1.jpg"
    //         },
    //         {
    //           "image_url": "cozonac-traditional-2.jpg"
    //         }
    //       ],
    //       "categories": [
    //         {
    //           "id": "6",
    //           "category_name": "Produse editie limitata",
    //           "slug": "produse-editie-limitata",
    //           "banner": null
    //         }
    //       ],
    //       "availableQuantities": [
    //         {
    //           "quantity": "1,2",
    //           "um": "kg",
    //           "portions": null
    //         }
    //       ],
    //       "information": [
    //         {
    //           "quantity": "1,2",
    //           "um": "kg",
    //           "price": "65",
    //           "portions": null
    //         }
    //       ]
    //     }
    //   },
    //   {
    //     item:
    //     {
    //       "product_name": "Cozonac Frantuzesc",
    //       "title": "Cozonac in stil frantuzesc? Mais oui!",
    //       "description": "Gustul copilariei, intr-o forma usor sofisticata, rasfatat cu unt frantuzesc, nuca si ciocolata din belsug.",
    //       "price": "65",
    //       "image": "cozonac-frantuzesc.jpg"
    //     },
    //     forCart:
    //     {
    //       "id": "57",
    //       "product_name": "Cozonac Frantuzesc",
    //       "alias": "cozonac-frantuzesc",
    //       "CategoryID": "6",
    //       "description": "",
    //       "ingredients": "Faina, lapte, oua, unt, aroma rom, aroma vanilie, coaja citrice, cacao, miez de nuca, cognac Vinars, rom brun",
    //       "images": [
    //         {
    //           "image_url": "cozonac-frantuzesc-1.jpg"
    //         },
    //         {
    //           "image_url": "cozonac-frantuzesc-2.jpg"
    //         }
    //       ],
    //       "categories": [
    //         {
    //           "id": "6",
    //           "category_name": "Produse editie limitata",
    //           "slug": "produse-editie-limitata",
    //           "banner": null
    //         }
    //       ],
    //       "availableQuantities": [
    //         {
    //           "quantity": "1",
    //           "um": "kg",
    //           "portions": null
    //         }
    //       ],
    //       "information": [
    //         {
    //           "quantity": "1",
    //           "um": "kg",
    //           "price": "65",
    //           "portions": null
    //         }
    //       ]
    //     }
    //   }
    // ]
  }

  addToCart(product) {
    this._cartService.addToCart(product, 1, false);
  }

}
