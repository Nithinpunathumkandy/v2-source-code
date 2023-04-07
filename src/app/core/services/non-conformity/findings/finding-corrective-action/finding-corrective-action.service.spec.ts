import { TestBed } from '@angular/core/testing';

import { FindingCorrectiveActionService } from './finding-corrective-action.service';

describe('FindingCorrectiveActionService', () => {
  let service: FindingCorrectiveActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindingCorrectiveActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
