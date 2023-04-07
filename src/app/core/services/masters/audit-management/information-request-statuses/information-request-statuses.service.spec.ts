import { TestBed } from '@angular/core/testing';

import { InformationRequestStatusesService } from './information-request-statuses.service';

describe('InformationRequestStatusesService', () => {
  let service: InformationRequestStatusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformationRequestStatusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
