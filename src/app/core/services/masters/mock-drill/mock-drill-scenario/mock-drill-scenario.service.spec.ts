import { TestBed } from '@angular/core/testing';

import { MockDrillScenarioService } from './mock-drill-scenario.service';

describe('MockDrillScenarioService', () => {
  let service: MockDrillScenarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDrillScenarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
