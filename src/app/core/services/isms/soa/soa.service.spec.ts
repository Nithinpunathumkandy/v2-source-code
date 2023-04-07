import { TestBed } from '@angular/core/testing';

import { SoaService } from './soa.service';

describe('SoaService', () => {
  let service: SoaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
