import { TestBed } from '@angular/core/testing';

import { ChecklistAnswersListService } from './checklist-answers-list.service';

describe('ChecklistAnswersListService', () => {
  let service: ChecklistAnswersListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChecklistAnswersListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
