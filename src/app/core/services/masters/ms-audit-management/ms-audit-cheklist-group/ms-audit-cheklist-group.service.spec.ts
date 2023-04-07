import { TestBed } from '@angular/core/testing';

import { BpmSuppliersService } from './bpm-suppliers.service';

describe('BpmSuppliersService', () => {
  let service: BpmSuppliersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpmSuppliersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
