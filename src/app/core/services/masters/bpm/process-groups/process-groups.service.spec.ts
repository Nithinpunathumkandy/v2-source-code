import { TestBed } from '@angular/core/testing';

import { ProcessGroupsService } from './process-groups.service';

describe('ProcessGroupsService', () => {
  let service: ProcessGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
