import { TestBed } from '@angular/core/testing';

import { EventMappingService } from './event-mapping.service';

describe('EventMappingService', () => {
  let service: EventMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
