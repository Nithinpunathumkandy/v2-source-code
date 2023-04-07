import { TestBed } from '@angular/core/testing';

import { StakeholderTypeService } from './stakeholder-type.service';

describe('StakeholderTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StakeholderTypeService = TestBed.get(StakeholderTypeService);
    expect(service).toBeTruthy();
  });
});
