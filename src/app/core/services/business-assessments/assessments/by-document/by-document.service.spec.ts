import { TestBed } from '@angular/core/testing';

import { ByDocumentService } from './by-document.service';

describe('ByDocumentService', () => {
  let service: ByDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ByDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
