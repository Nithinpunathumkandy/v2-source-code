import { TestBed } from '@angular/core/testing';

import { PeriodicBackupService } from './periodic-backup.service';

describe('PeriodicBackupService', () => {
  let service: PeriodicBackupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodicBackupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
