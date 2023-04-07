import { TestBed } from '@angular/core/testing';

import { AssetMatrixService } from './asset-matrix.service';

describe('AssetMatrixService', () => {
  let service: AssetMatrixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetMatrixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
