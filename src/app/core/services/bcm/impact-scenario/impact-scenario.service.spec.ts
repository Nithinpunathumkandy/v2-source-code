import { TestBed } from '@angular/core/testing';

import { ImpactScenarioService } from './impact-scenario.service';

describe('ImpactScenarioService', () => {
  let service: ImpactScenarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpactScenarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
