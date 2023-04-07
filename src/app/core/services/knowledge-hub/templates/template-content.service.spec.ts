import { TestBed } from '@angular/core/testing';

import { TemplateContentService } from './template-content.service';

describe('TemplateContentService', () => {
  let service: TemplateContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
