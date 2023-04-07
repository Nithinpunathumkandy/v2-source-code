import { TestBed } from '@angular/core/testing';

import { BiaTireService } from './bia-tire.service';

describe('BiaTireService', () => {
  let service: BiaTireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiaTireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
