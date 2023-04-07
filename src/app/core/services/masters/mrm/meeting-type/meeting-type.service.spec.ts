import { TestBed } from '@angular/core/testing';

import { MeetingTypeService } from './meeting-type.service';

describe('MeetingTypeService', () => {
  let service: MeetingTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
