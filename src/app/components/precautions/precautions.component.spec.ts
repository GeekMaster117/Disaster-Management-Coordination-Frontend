import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecautionsComponent } from './precautions.component';

describe('PrecautionsComponent', () => {
  let component: PrecautionsComponent;
  let fixture: ComponentFixture<PrecautionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrecautionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrecautionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
