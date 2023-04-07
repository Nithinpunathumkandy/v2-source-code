import { TestBed } from '@angular/core/testing';

import { EventDocumentsService } from './event-documents.service';

describe('EventDocumentsService', () => {
  let service: EventDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
