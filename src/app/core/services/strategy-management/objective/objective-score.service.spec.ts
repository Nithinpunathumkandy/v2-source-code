import { TestBed } from '@angular/core/testing';

import { ObjectiveScoreService } from './objective-score.service';

describe('ObjectiveScoreService', () => {
  let service: ObjectiveScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectiveScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
