import { TestBed } from '@angular/core/testing';

import { UserAclService } from './user-acl.service';

describe('UserAclService', () => {
  let service: UserAclService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAclService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
