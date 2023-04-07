import { TestBed } from '@angular/core/testing';

import { BcsFinancesService } from './bcs-finances.service';

describe('BcsFinancesService', () => {
  let service: BcsFinancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcsFinancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
