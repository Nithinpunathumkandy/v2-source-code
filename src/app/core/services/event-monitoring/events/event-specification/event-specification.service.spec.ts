import { TestBed } from '@angular/core/testing';

import { EventSpecificationService } from './event-specification.service';

describe('EventSpecificationService', () => {
  let service: EventSpecificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventSpecificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
