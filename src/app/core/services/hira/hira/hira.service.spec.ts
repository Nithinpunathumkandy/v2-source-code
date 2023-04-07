import { TestBed } from '@angular/core/testing';

import { HiraService } from './hira.service';

describe('HiraService', () => {
  let service: HiraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
