import { TestBed } from '@angular/core/testing';

import { HiraMappingService } from './hira-mapping.service';

describe('HiraMappingService', () => {
  let service: HiraMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiraMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
