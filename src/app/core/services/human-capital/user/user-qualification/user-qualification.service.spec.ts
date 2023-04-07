import { TestBed } from '@angular/core/testing';

import { UserQualificationService } from './user-qualification.service';

describe('UserQualificationService', () => {
  let service: UserQualificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserQualificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
