import { TestBed } from '@angular/core/testing';

import { HiraInfoWorkflowService } from './hira-info-workflow.service';

describe('HiraInfoWorkflowService', () => {
  let service: HiraInfoWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiraInfoWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
