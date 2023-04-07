import { TestBed } from '@angular/core/testing';

import { CorrectiveActionService } from './corrective-action.service';

describe('CorrectiveActionService', () => {
  let service: CorrectiveActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorrectiveActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
