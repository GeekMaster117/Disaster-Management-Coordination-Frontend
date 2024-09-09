import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-earthquake-headlines',
  templateUrl: './earthquake-headlines.component.html',
  styleUrls: ['./earthquake-headlines.component.css']
})
export class EarthquakeHeadlinesComponent implements OnInit {
  headlines$: Observable<any> = of({ features: [] });

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.headlines$ = this.http.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson').pipe(
      catchError(() => of({ features: [] })) // Handle errors and provide an empty object
    );
  }
}
