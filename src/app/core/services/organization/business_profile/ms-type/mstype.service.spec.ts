import { TestBed } from '@angular/core/testing';

import { MstypeService } from './mstype.service';

describe('MstypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MstypeService = TestBed.get(MstypeService);
    expect(service).toBeTruthy();
  });
});
