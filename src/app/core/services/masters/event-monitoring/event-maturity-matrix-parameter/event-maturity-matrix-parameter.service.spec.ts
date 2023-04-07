import { TestBed } from '@angular/core/testing';

import { EventMaturityMatrixParameterService } from './event-maturity-matrix-parameter.service';

describe('EventMaturityMatrixParameterService', () => {
  let service: EventMaturityMatrixParameterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventMaturityMatrixParameterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
