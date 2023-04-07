import { TestBed } from '@angular/core/testing';

import { ProcessAccessibilityService } from './process-accessibility.service';

describe('ProcessAccessibilityService', () => {
  let service: ProcessAccessibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessAccessibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
