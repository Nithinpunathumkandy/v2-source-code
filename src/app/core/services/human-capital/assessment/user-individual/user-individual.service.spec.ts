import { TestBed } from '@angular/core/testing';

import { UserIndividualService } from './user-individual.service';

describe('UserIndividualService', () => {
  let service: UserIndividualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserIndividualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
