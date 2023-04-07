import { TestBed } from '@angular/core/testing';

import { EventInfluenceService } from './event-influence.service';

describe('EventInfluenceService', () => {
  let service: EventInfluenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventInfluenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
