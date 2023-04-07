import { TestBed } from '@angular/core/testing';

import { NeedExpectationService } from './need-expectation.service';

describe('NeedExpectationService', () => {
  let service: NeedExpectationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeedExpectationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
