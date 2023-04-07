import { TestBed } from '@angular/core/testing';

import { ControlModeService } from './control-mode.service';

describe('ControlModeService', () => {
  let service: ControlModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
