import { TestBed } from '@angular/core/testing';

import { AssetOptionValuesService } from './asset-option-values.service';

describe('AssetOptionValuesService', () => {
  let service: AssetOptionValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetOptionValuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
