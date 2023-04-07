import { TestBed } from '@angular/core/testing';

import { KriService } from './kri.service';

describe('KriService', () => {
  let service: KriService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KriService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
