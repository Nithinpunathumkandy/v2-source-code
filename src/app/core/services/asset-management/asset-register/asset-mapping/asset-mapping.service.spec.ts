import { TestBed } from '@angular/core/testing';

import { AssetMappingService } from './asset-mapping.service';

describe('AssetMappingService', () => {
  let service: AssetMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
