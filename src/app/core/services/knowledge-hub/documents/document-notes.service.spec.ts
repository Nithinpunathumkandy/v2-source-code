import { TestBed } from '@angular/core/testing';

import { DocumentNotesService } from './document-notes.service';

describe('DocumentNotesService', () => {
  let service: DocumentNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
