import { TestBed } from '@angular/core/testing';

import { ChecklistQuestionsService } from './checklist-questions.service';

describe('ChecklistQuestionsService', () => {
  let service: ChecklistQuestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChecklistQuestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
