import { TestBed } from '@angular/core/testing';

import { TrainingStatusService } from './training-status.service';

describe('TrainingStatusService', () => {
  let service: TrainingStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
