import { TestBed } from '@angular/core/testing';

import { KpiWorkflowService } from './kpi-workflow.service';

describe('KpiWorkflowService', () => {
  let service: KpiWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
