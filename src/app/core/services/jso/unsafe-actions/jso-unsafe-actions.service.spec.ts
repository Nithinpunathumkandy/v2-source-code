import { TestBed } from '@angular/core/testing';

import { JsoUnsafeActionsService } from './jso-unsafe-actions.service';

describe('JsoUnsafeActionsService', () => {
  let service: JsoUnsafeActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsoUnsafeActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
