import { TestBed } from '@angular/core/testing';

import { JsoObservationTypeService } from './jso-observation-type.service';

describe('JsoObservationTypeService', () => {
  let service: JsoObservationTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsoObservationTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
