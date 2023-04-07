import { TestBed } from '@angular/core/testing';

import { StakeholdersListService } from './stakeholders-list.service';

describe('StakeholdersListService', () => {
  let service: StakeholdersListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StakeholdersListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
