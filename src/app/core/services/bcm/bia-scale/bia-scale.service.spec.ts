import { TestBed } from '@angular/core/testing';

import { BiaScaleService } from './bia-scale.service';

describe('BiaScaleService', () => {
  let service: BiaScaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiaScaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
