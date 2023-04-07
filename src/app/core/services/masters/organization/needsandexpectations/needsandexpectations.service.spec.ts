import { TestBed } from '@angular/core/testing';

import { NeedsandexpectationsService } from './needsandexpectations.service';

describe('NeedsandexpectationsService', () => {
  let service: NeedsandexpectationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeedsandexpectationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
