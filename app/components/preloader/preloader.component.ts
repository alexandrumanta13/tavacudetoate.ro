import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss']
})
export class PreloaderComponent implements OnInit {
  @ViewChild('loader') loader;

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    console.log()
    setTimeout(() => {
      this.loader.nativeElement.style.display = "none"

    }, 2000);
  }

}
