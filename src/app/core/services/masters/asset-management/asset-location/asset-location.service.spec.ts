import { TestBed } from '@angular/core/testing';

import { AssetLocationService } from './asset-location.service';

describe('AssetLocationService', () => {
  let service: AssetLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
