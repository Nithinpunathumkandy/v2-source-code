import { TestBed } from '@angular/core/testing';

import { CyberIncidentWorkflowService } from './cyber-incident-workflow.service';

describe('CyberIncidentWorkflowService', () => {
  let service: CyberIncidentWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CyberIncidentWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
