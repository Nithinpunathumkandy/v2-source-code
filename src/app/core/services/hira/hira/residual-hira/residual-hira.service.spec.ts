import { TestBed } from '@angular/core/testing';

import { ResidualHiraService } from './residual-hira.service';

describe('ResidualHiraService', () => {
  let service: ResidualHiraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResidualHiraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
