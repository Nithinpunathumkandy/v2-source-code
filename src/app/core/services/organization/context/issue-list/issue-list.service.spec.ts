import { TestBed } from '@angular/core/testing';

import { IssueListService } from './issue-list.service';

describe('IssueListService', () => {
  let service: IssueListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
