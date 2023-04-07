import { TestBed } from '@angular/core/testing';

import { FocusAreaService } from './focus-area.service';

describe('FocusAreaService', () => {
  let service: FocusAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FocusAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
