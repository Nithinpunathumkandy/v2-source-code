import { TestBed } from '@angular/core/testing';

import { StrategicObjectivesMappingService } from './strategic-objectives-mapping.service';

describe('StrategicObjectivesMappingService', () => {
  let service: StrategicObjectivesMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategicObjectivesMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
