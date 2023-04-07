import { TestBed } from '@angular/core/testing';

import { HiraTreatmentService } from './hira-treatment.service';

describe('HiraTreatmentService', () => {
  let service: HiraTreatmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiraTreatmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
