import { TestBed } from '@angular/core/testing';

import { MsTypeService } from './ms-type.service';

describe('MsTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MsTypeService = TestBed.get(MsTypeService);
    expect(service).toBeTruthy();
  });
});
