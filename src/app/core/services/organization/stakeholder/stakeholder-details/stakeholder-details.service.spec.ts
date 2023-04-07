import { TestBed } from '@angular/core/testing';

import { StakeholderDetailsService } from './stakeholder-details.service';

describe('StakeholderDetailsService', () => {
  let service: StakeholderDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StakeholderDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
