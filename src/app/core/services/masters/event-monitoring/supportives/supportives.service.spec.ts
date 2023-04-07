import { TestBed } from '@angular/core/testing';

import { SupportivesService } from './supportives.service';

describe('SupportivesService', () => {
  let service: SupportivesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportivesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
