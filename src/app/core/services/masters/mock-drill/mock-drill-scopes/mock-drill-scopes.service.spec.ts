import { TestBed } from '@angular/core/testing';

import { MockDrillScopesService } from './mock-drill-scopes.service';

describe('MockDrillScopesService', () => {
  let service: MockDrillScopesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDrillScopesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
