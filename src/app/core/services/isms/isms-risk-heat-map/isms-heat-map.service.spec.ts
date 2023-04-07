import { TestBed } from '@angular/core/testing';

import { IsmsHeatMapService } from './isms-heat-map.service';

describe('IsmsHeatMapService', () => {
  let service: IsmsHeatMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsHeatMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
