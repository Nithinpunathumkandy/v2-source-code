import { TestBed } from '@angular/core/testing';

import { MockDrillTypesService } from './mock-drill-types.service';

describe('MockDrillTypesService', () => {
  let service: MockDrillTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDrillTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
