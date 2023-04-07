import { TestBed } from '@angular/core/testing';

import { MockDrillWorkflowService } from './mock-drill-workflow.service';

describe('MockDrillWorkflowService', () => {
  let service: MockDrillWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDrillWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
