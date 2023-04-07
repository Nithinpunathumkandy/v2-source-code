import { TestBed } from '@angular/core/testing';

import { ProfileKpiService } from './profile-kpi.service';

describe('ProfileKpiService', () => {
  let service: ProfileKpiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileKpiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
