import { TestBed } from '@angular/core/testing';

import { JsoObservationsService } from './jso-observations.service';

describe('JsoObservationsService', () => {
  let service: JsoObservationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsoObservationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
