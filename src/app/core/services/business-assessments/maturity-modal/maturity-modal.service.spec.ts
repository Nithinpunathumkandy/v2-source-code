import { TestBed } from '@angular/core/testing';

import { MaturityModalService } from './maturity-modal.service';

describe('MaturityModalService', () => {
  let service: MaturityModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaturityModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
