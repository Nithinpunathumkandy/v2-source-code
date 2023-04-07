import { TestBed } from '@angular/core/testing';

import { ByPdcaService } from './by-pdca.service';

describe('ByPdcaService', () => {
  let service: ByPdcaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ByPdcaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
