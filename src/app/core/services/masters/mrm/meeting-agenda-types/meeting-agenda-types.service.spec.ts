import { TestBed } from '@angular/core/testing';

import { MeetingAgendaTypesService } from './meeting-agenda-types.service';

describe('MeetingAgendaTypesService', () => {
  let service: MeetingAgendaTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingAgendaTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
