import { TestBed } from '@angular/core/testing';

import { AssetRegisterService } from './asset-register.service';

describe('AssetRegisterService', () => {
  let service: AssetRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
