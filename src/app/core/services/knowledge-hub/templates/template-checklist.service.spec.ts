import { TestBed } from '@angular/core/testing';

import { TemplateChecklistService } from './template-checklist.service';

describe('TemplateChecklistService', () => {
  let service: TemplateChecklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateChecklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
