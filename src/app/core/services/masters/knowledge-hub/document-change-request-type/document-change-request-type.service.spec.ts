import { TestBed } from '@angular/core/testing';

import { DocumentChangeRequestTypeService } from './document-change-request-type.service';

describe('DocumentChangeRequestTypeService', () => {
  let service: DocumentChangeRequestTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentChangeRequestTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
