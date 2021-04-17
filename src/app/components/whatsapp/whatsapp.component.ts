import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.scss']
})
export class WhatsappComponent implements OnInit {
  open: any;

  constructor() { }

  ngOnInit(): void {
  }

  toggle() {
    this.open = !this.open;
    
  }

}
