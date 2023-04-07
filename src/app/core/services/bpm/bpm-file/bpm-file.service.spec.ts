import { TestBed } from '@angular/core/testing';

import { BpmFileService } from './bpm-file.service';

describe('BpmFileService', () => {
  let service: BpmFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpmFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
