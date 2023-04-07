import { TestBed } from '@angular/core/testing';

import { UserIntegrationService } from './user-integration.service';

describe('UserIntegrationService', () => {
  let service: UserIntegrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserIntegrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
