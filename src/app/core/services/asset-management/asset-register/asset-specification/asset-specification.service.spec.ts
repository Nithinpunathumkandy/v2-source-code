import { TestBed } from '@angular/core/testing';

import { AssetSpecificationService } from './asset-specification.service';

describe('AssetSpecificationService', () => {
  let service: AssetSpecificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetSpecificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
