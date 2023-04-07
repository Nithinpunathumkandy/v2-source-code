import { TestBed } from '@angular/core/testing';

import { EventRiskResidualService } from './event-risk-residual.service';

describe('EventRiskResidualService', () => {
  let service: EventRiskResidualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventRiskResidualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
