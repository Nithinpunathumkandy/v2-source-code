import { TestBed } from '@angular/core/testing';

import { AmCsaService } from './am-csa.service';

describe('AmCsaService', () => {
  let service: AmCsaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmCsaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
