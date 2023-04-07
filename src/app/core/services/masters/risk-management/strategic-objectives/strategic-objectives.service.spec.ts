import { TestBed } from '@angular/core/testing';

import { StrategicObjectivesService } from './strategic-objectives.service';

describe('StrategicObjectivesService', () => {
  let service: StrategicObjectivesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategicObjectivesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
