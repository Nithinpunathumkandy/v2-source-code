import { TestBed } from '@angular/core/testing';

import { EventFileServiceService } from './event-file-service.service';

describe('EventFileServiceService', () => {
  let service: EventFileServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventFileServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
