import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  fullYear: Date = new Date();
  getYear;
  
  @Output() navigate = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.getYear = this.fullYear.getFullYear();
  }

 
  changeLink(){
    this.navigate.emit(null)
  }

}
