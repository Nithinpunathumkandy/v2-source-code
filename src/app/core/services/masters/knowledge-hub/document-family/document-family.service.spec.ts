import { TestBed } from '@angular/core/testing';

import { DocumentFamilyService } from './document-family.service';

describe('DocumentFamilyService', () => {
  let service: DocumentFamilyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentFamilyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
