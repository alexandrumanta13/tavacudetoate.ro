import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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

  constructor(private router: Router) { }

  ngOnInit(): void {
    
     this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.open = false;
      
    });
  } 

  toggleMenu(menu) {
    console.log(menu)
    this.open = !this.open;
    this.navMenu = menu;
  }

}
