import { TestBed } from '@angular/core/testing';

import { ByMsTypeService } from './by-ms-type.service';

describe('ByMsTypeService', () => {
  let service: ByMsTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ByMsTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
