import { TestBed } from '@angular/core/testing';

import { SwotService } from './swot.service';

describe('SwotService', () => {
  let service: SwotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
