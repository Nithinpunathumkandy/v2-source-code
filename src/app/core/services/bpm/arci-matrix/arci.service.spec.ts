import { TestBed } from '@angular/core/testing';

import { ArciService } from './arci.service';

describe('ArciService', () => {
  let service: ArciService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArciService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
