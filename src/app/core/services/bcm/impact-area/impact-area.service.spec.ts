import { TestBed } from '@angular/core/testing';

import { ImpactAreaService } from './impact-area.service';

describe('ImpactAreaService', () => {
  let service: ImpactAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpactAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
