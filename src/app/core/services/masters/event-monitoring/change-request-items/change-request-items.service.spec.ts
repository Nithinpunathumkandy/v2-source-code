import { TestBed } from '@angular/core/testing';

import { ChangeRequestItemsService } from './change-request-items.service';

describe('ChangeRequestItemsService', () => {
  let service: ChangeRequestItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeRequestItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
