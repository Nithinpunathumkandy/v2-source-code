import { TestBed } from '@angular/core/testing';

import { NgbDateCustomParserFormatterService } from './ngb-date-custom-parser-formatter.service';

describe('NgbDateCustomParserFormatterService', () => {
  let service: NgbDateCustomParserFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgbDateCustomParserFormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
