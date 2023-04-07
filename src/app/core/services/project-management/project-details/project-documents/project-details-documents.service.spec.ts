import { TestBed } from '@angular/core/testing';

import { ProjectDetailsDocumentsService } from './project-details-documents.service';

describe('ProjectDetailsDocumentsService', () => {
  let service: ProjectDetailsDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectDetailsDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
