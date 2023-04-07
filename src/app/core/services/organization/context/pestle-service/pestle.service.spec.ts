import { TestBed } from '@angular/core/testing';

import { PestleService } from './pestle.service';

describe('PestleService', () => {
  let service: PestleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PestleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
