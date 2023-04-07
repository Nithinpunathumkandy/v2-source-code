import { TestBed } from '@angular/core/testing';

import { BiaService } from './bia.service';

describe('BiaService', () => {
  let service: BiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
