import { TestBed } from '@angular/core/testing';

import { ProfileCompetenciesService } from './profile-competencies.service';

describe('ProfileCompetenciesService', () => {
  let service: ProfileCompetenciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileCompetenciesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
