import { TestBed } from '@angular/core/testing';

import { UserDocumentTypeService } from './user-document-type.service';

describe('UserDocumentTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserDocumentTypeService = TestBed.get(UserDocumentTypeService);
    expect(service).toBeTruthy();
  });
});
