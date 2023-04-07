import { TestBed } from '@angular/core/testing';

import { HiraFileService } from './hira-file.service';

describe('HiraFileService', () => {
  let service: HiraFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiraFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
