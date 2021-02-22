import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
declare var $: any;
@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    margin: 30,
    nav: false,
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
  video: any = false;

  constructor() { }

  id = 'btfgGf2wDgI';
  private player;
  private ytEvent;




  ngOnInit(): void {

    const tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

  }

  playVideo() {
    this.video = !this.video
    // this.video.playVideo();
  }

  

  ngAfterViewInit() {
    // let playVideo: HTMLElement = document.querySelector('#play-video') as HTMLElement;
    // let checkExist = setInterval(function () {
    //   if (playVideo && playVideo instanceof HTMLElement) {

    //     setTimeout(() => {
    //       $('#play-video').on('click', function (ev) {

    //         $("#video")[0].src += "&autoplay=1";
    //         ev.preventDefault();

    //       });
    //     }, 3000);

    //     clearInterval(checkExist);
    //   }
    // }, 100); // check every 100ms

  }

}
