import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendCardComponent } from './legend-card.component';

describe('LegendCardComponent', () => {
  let component: LegendCardComponent;
  let fixture: ComponentFixture<LegendCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LegendCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegendCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
