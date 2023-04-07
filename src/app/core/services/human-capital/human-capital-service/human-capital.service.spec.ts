import { TestBed } from '@angular/core/testing';

import { HumanCapitalService } from './human-capital.service';

describe('HumanCapitalService', () => {
  let service: HumanCapitalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HumanCapitalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
