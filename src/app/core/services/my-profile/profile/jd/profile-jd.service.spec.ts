import { TestBed } from '@angular/core/testing';

import { ProfileJdService } from './profile-jd.service';

describe('ProfileJdService', () => {
  let service: ProfileJdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileJdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
