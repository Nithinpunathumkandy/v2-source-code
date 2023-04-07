import { TestBed } from '@angular/core/testing';

import { AprService } from './apr.service';

describe('AprService', () => {
  let service: AprService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AprService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
