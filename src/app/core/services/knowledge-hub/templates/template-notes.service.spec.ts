import { TestBed } from '@angular/core/testing';

import { TemplateNotesService } from './template-notes.service';

describe('TemplateNotesService', () => {
  let service: TemplateNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
