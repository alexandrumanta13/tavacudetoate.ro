import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  locations: any;

  constructor(
    private _httpClient: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getLocations()
  }

  getLocations() {
    this._httpClient.get('https://tavacudetoate.ro/tavacudetoate-api/v1/locationsAll').subscribe((data: any) => {
      this.locations = data;
    });
  }

}
