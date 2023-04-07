import { TestBed } from '@angular/core/testing';

import { AclProfilesettingService } from './acl-profilesetting.service';

describe('AclProfilesettingService', () => {
  let service: AclProfilesettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AclProfilesettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
