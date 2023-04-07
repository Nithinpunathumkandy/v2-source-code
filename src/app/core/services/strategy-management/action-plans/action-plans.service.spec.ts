import { TestBed } from '@angular/core/testing';

import { ActionPlansService } from './action-plans.service';

describe('ActionPlansService', () => {
  let service: ActionPlansService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionPlansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
