import { TestBed } from '@angular/core/testing';

import { HiraRcaService } from './hira-rca.service';

describe('HiraRcaService', () => {
  let service: HiraRcaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiraRcaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
