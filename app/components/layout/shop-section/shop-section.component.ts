import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';


@Component({
	selector: 'app-shop-section',
	templateUrl: './shop-section.component.html',
	styleUrls: ['./shop-section.component.scss']
})
export class ShopSectionComponent implements OnInit {
	customOptions: OwlOptions = {
		loop: true,
		margin: 30,

		
		smartSpeed: 500,
		autoplay: true,
		navText: ['<span class="icon-Arrow-Left"></span>', '<span class="icon-Arrow-Right"></span>'],
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 2
			},
			800: {
				items: 3
			},
			1024: {
				items: 4
			},
			1200: {
				items: 4
			}
		}
	}


	constructor() { }

	ngOnInit(): void {
	}

}
