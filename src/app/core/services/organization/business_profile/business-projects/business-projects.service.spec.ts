import { TestBed } from '@angular/core/testing';

import { BusinessProjectsService } from './business-projects.service';

describe('BusinessProjectsService', () => {
  let service: BusinessProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
