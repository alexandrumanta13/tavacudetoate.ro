import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  customOptions: OwlOptions = {
    loop:true,
			margin:88,
			nav:true,
			smartSpeed: 500,
		
			navText: [ '<span class="fa fa-angle-left"></span>', '<span class="fa fa-angle-right"></span>' ],
			responsive:{
				0:{
					items:1,
					margin:30
				},
				480:{
					items:1,
					margin:30
				},
				600:{
					items:1,
					margin:30
				},
				800:{
					items:2,
					margin:30
				},
				1024:{
					items:2,
					margin:30
				}
			}
  }

  ngOnInit(): void {
  }

  

}
