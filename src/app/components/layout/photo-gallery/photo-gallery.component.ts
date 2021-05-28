import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss']
})
export class PhotoGalleryComponent implements OnInit {

  constructor(private elRef:ElementRef) { }

  ngOnInit(): void {
    
  }

 

  ngAfterViewInit() {
      
  }

  enableMasonry() {
    

  }

}
