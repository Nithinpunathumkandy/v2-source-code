import { TestBed } from '@angular/core/testing';

import { ProfileDocumentsService } from './profile-documents.service';

describe('ProfileDocumentsService', () => {
  let service: ProfileDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
