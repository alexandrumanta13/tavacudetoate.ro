import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  @Output() navigate = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  changeLink(){
    this.navigate.emit(null)
  }

}
