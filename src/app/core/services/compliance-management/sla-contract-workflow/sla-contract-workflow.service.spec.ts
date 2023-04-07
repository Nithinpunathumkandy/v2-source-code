import { TestBed } from '@angular/core/testing';

import { SlaContractWorkflowService } from './sla-contract-workflow.service';

describe('SlaContractWorkflowService', () => {
  let service: SlaContractWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlaContractWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
