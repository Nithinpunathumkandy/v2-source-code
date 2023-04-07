import { TestBed } from '@angular/core/testing';

import { DocumentSystemTypeService } from './document-system-type.service';

describe('DocumentSystemTypeService', () => {
  let service: DocumentSystemTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentSystemTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
