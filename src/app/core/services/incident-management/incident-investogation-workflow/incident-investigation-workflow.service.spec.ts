import { TestBed } from '@angular/core/testing';

import { IncidentInvestigationWorkflowService } from './incident-investigation-workflow.service';

describe('IncidentInvestigationWorkflowService', () => {
  let service: IncidentInvestigationWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentInvestigationWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
