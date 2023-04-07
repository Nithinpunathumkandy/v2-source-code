import { TestBed } from '@angular/core/testing';

import { ChangeRequestContentService } from './change-request-content.service';

describe('ChangeRequestContentService', () => {
  let service: ChangeRequestContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeRequestContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
