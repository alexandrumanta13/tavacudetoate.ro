import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  customOptions: OwlOptions = {
    loop: true,
    nav: true,
    autoplay: true,
    autoplayTimeout: 5000,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      800: {
        items: 1
      },
      1024: {
        items: 1
      }
    }
  }

  ngOnInit(): void {


  }

  goToEasterMenu() {
    this.router.navigate(['/masa-de-paste-2021']);
  }

}
