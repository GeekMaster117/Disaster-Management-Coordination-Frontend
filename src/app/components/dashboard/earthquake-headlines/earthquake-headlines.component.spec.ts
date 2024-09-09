import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarthquakeHeadlinesComponent } from './earthquake-headlines.component';

describe('EarthquakeHeadlinesComponent', () => {
  let component: EarthquakeHeadlinesComponent;
  let fixture: ComponentFixture<EarthquakeHeadlinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EarthquakeHeadlinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarthquakeHeadlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
