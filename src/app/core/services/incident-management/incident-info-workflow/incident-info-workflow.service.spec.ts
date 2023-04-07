import { TestBed } from '@angular/core/testing';

import { IncidentInfoWorkflowService } from './incident-info-workflow.service';

describe('IncidentInfoWorkflowService', () => {
  let service: IncidentInfoWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentInfoWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
