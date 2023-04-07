import { TestBed } from '@angular/core/testing';

import { IsmsService } from './isms.service';

describe('IsmsService', () => {
  let service: IsmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
