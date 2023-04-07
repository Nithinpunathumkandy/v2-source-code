import { TestBed } from '@angular/core/testing';

import { EventTeamService } from './event-team.service';

describe('EventTeamService', () => {
  let service: EventTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventTeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
