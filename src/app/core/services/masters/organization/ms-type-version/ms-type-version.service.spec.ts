import { TestBed } from '@angular/core/testing';

import { MsTypeVersionService } from './ms-type-version.service';

describe('MsTypeVersionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MsTypeVersionService = TestBed.get(MsTypeVersionService);
    expect(service).toBeTruthy();
  });
});
