import { TestBed } from '@angular/core/testing';

import { SlaStatusesService } from './sla-statuses.service';

describe('SlaStatusesService', () => {
  let service: SlaStatusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlaStatusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
