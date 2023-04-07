import { TestBed } from '@angular/core/testing';

import { KeyriskindicatorsService } from './keyriskindicators.service';

describe('KeyriskindicatorsService', () => {
  let service: KeyriskindicatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyriskindicatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
