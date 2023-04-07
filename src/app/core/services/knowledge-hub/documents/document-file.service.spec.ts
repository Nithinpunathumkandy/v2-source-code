import { TestBed } from '@angular/core/testing';

import { DocumentFileService } from './document-file.service';

describe('DocumentFileService', () => {
  let service: DocumentFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
