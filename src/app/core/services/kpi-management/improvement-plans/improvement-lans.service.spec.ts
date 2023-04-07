import { TestBed } from '@angular/core/testing';

import { ImprovementLansService } from './improvement-lans.service';

describe('ImprovementLansService', () => {
  let service: ImprovementLansService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImprovementLansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
