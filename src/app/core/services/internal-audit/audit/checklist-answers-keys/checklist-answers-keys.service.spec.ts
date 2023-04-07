import { TestBed } from '@angular/core/testing';

import { ChecklistAnswersKeysService } from './checklist-answers-keys.service';

describe('ChecklistAnswersKeysService', () => {
  let service: ChecklistAnswersKeysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChecklistAnswersKeysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
