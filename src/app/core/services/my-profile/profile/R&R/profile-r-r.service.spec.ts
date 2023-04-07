import { TestBed } from '@angular/core/testing';

import { ProfileRRService } from './profile-r-r.service';

describe('ProfileRRService', () => {
  let service: ProfileRRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileRRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
