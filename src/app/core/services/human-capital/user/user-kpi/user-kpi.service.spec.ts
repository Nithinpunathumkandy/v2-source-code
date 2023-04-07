import { TestBed } from '@angular/core/testing';

import { UserKpiService } from './user-kpi.service';

describe('UserKpiService', () => {
  let service: UserKpiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserKpiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
