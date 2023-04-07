import { TestBed } from '@angular/core/testing';

import { AssetCriticalityService } from './asset-criticality.service';

describe('AssetCriticalityService', () => {
  let service: AssetCriticalityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetCriticalityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
