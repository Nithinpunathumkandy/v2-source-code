import { TestBed } from '@angular/core/testing';

import { ChangeRequestNoteService } from './change-request-note.service';

describe('ChangeRequestNoteService', () => {
  let service: ChangeRequestNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeRequestNoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
