import { TestBed } from '@angular/core/testing';

import { MrmWorkflowService } from './mrm-workflow.service';

describe('MrmWorkflowService', () => {
  let service: MrmWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MrmWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
