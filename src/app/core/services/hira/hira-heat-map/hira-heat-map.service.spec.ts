import { TestBed } from '@angular/core/testing';

import { HiraHeatMapService } from './hira-heat-map.service';

describe('HiraHeatMapService', () => {
  let service: HiraHeatMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiraHeatMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
