import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ProductsService } from 'src/app/pages/products/products.service';
declare var $: any;
@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss']
})

export class MobileMenuComponent implements OnInit {
  open: boolean;
  submenuOpen: boolean;
  navMenu: any;
  categories: any;

  constructor(private router: Router,private _ProductsService: ProductsService) { }

  ngOnInit(): void {

    this._ProductsService.getCategories().then(data => {
      this.categories = data.categories;
    })
    
     this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.open = false;
      
    });
  } 

  toggleMenu(menu) {
    this.open = !this.open;
    this.navMenu = menu;
  }

}
