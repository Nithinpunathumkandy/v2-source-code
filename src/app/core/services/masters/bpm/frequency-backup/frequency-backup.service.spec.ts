import { TestBed } from '@angular/core/testing';

import { FrequencyBackupService } from './frequency-backup.service';

describe('FrequencyBackupService', () => {
  let service: FrequencyBackupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrequencyBackupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
