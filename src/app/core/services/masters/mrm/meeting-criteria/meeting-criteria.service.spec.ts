import { TestBed } from '@angular/core/testing';

import { MeetingCriteriaService } from './meeting-criteria.service';

describe('MeetingCriteriaService', () => {
  let service: MeetingCriteriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingCriteriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
