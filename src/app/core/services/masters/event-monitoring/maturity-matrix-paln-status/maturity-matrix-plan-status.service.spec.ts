import { TestBed } from '@angular/core/testing';

import { MaturityMatrixPlanStatusService } from './maturity-matrix-plan-status.service';

describe('MaturityMatrixPlanStatusService', () => {
  let service: MaturityMatrixPlanStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaturityMatrixPlanStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
