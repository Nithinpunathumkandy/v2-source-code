import { TestBed } from '@angular/core/testing';

import { BcsTypeService } from './bcs-type.service';

describe('BcsTypeService', () => {
  let service: BcsTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcsTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
