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

  constructor(private router: Router) { }

  ngOnInit(): void {
    $('.mobile-menu li.dropdown .dropdown-btn').on('click', function() {
     
      $(this).toggleClass('open');
      $(this).prev('ul').slideToggle(500);
    });
    $('.mobile-menu li a.dropdown-btn-parent_1').on('click', function() {
     console.log($('.dropdon-list-toggle_1'))
      $(this).next().next().toggleClass('open');
      $('.dropdon-list-toggle_1').slideToggle(500);
    });
    $('.mobile-menu li a.dropdown-btn-parent_2').on('click', function() {
      console.log($('.dropdon-list-toggle_2'))
       $(this).next().next().toggleClass('open');
       $('.dropdon-list-toggle_2').slideToggle(500);
     });

     this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.open = false;
      
    });
  }

  

  toggleMenu() {
    this.open = !this.open;
  }

}
