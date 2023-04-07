import { TestBed } from '@angular/core/testing';

import { FindingCommentService } from './finding-comment.service';

describe('FindingCommentService', () => {
  let service: FindingCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindingCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
