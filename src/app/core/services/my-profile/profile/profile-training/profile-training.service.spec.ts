import { TestBed } from '@angular/core/testing';

import { ProfileTrainingService } from './profile-training.service';

describe('ProfileTrainingService', () => {
  let service: ProfileTrainingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileTrainingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
