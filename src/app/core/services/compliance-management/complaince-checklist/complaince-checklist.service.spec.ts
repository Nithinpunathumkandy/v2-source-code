import { TestBed } from '@angular/core/testing';

import { ComplainceChecklistService } from './complaince-checklist.service';

describe('ComplainceChecklistService', () => {
  let service: ComplainceChecklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplainceChecklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
