import { TestBed } from '@angular/core/testing';

import { IncidentCaWorkflowService } from './incident-ca-workflow.service';

describe('IncidentCaWorkflowService', () => {
  let service: IncidentCaWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentCaWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
