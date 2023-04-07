import { TestBed } from '@angular/core/testing';

import { BcmStrategiesService } from './bcm-strategies.service';

describe('BcmStrategiesService', () => {
  let service: BcmStrategiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcmStrategiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
