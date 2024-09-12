import { TestBed } from '@angular/core/testing';

import { AffectedAreaService } from './affected-area.service';

describe('AffectedAreaService', () => {
  let service: AffectedAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffectedAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
