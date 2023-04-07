import { TestBed } from '@angular/core/testing';

import { DocumentChecklistService } from './document-checklist.service';

describe('DocumentChecklistService', () => {
  let service: DocumentChecklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentChecklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
