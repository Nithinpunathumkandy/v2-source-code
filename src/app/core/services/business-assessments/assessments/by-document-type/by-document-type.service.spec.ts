import { TestBed } from '@angular/core/testing';

import { ByDocumentTypeService } from './by-document-type.service';

describe('ByDocumentTypeService', () => {
  let service: ByDocumentTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ByDocumentTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
