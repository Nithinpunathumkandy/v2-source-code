import { TestBed } from '@angular/core/testing';

import { ControlEfficiencyMeasuresService } from './control-efficiency-measures.service';

describe('ControlEfficiencyMeasuresService', () => {
  let service: ControlEfficiencyMeasuresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlEfficiencyMeasuresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
