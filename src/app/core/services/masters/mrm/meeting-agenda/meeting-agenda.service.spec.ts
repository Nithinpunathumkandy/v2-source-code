import { TestBed } from '@angular/core/testing';

import { MeetingAgendaService } from './meeting-agenda.service';

describe('MeetingAgendaService', () => {
  let service: MeetingAgendaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingAgendaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
