import { TestBed } from '@angular/core/testing';

import { EventRiskImpactAreaService } from './event-risk-impact-area.service';

describe('EventRiskImpactAreaService', () => {
  let service: EventRiskImpactAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventRiskImpactAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
