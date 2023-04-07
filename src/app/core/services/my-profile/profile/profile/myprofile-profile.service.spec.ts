import { TestBed } from '@angular/core/testing';

import { MyprofileProfileService } from './myprofile-profile.service';

describe('MyprofileProfileService', () => {
  let service: MyprofileProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyprofileProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
