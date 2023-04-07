import { TestBed } from '@angular/core/testing';

import { MeetingCategoryService } from './meeting-category.service';

describe('MeetingCategoryService', () => {
  let service: MeetingCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
