import { TestBed } from '@angular/core/testing';

import { IssueStatusService } from './issue-status.service';

describe('IssueStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IssueStatusService = TestBed.get(IssueStatusService);
    expect(service).toBeTruthy();
  });
});
