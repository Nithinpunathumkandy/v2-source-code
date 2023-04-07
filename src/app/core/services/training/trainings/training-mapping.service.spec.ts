import { TestBed } from '@angular/core/testing';

import { TrainingMappingService } from './training-mapping.service';

describe('TrainingMappingService', () => {
  let service: TrainingMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
