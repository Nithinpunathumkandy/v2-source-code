import { TestBed } from '@angular/core/testing';

import { IsmsImpactService } from './isms-impact.service';

describe('IsmsImpactService', () => {
  let service: IsmsImpactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsImpactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
