import { TestBed } from '@angular/core/testing';

import { UserCertificateService } from './user-certificate.service';

describe('UserCertificateService', () => {
  let service: UserCertificateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCertificateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
