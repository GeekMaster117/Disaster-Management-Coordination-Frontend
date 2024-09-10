import { TestBed } from '@angular/core/testing';

import { RefugeeCampService } from './refugee-camp.service';

describe('RefugeeCampService', () => {
  let service: RefugeeCampService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefugeeCampService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
