import { TestBed } from '@angular/core/testing';

import { UserWorkExperienceService } from './user-work-experience.service';

describe('UserWorkExperienceService', () => {
  let service: UserWorkExperienceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserWorkExperienceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
