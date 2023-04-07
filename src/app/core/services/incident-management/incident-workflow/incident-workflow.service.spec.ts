import { TestBed } from '@angular/core/testing';

import { IncidentWorkflowService } from './incident-workflow.service';

describe('IncidentWorkflowService', () => {
  let service: IncidentWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
