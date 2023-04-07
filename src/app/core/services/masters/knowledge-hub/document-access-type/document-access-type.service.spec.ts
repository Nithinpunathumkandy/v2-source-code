import { TestBed } from '@angular/core/testing';

import { DocumentAccessTypeService } from './document-access-type.service';

describe('DocumentAccessTypeService', () => {
  let service: DocumentAccessTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentAccessTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
