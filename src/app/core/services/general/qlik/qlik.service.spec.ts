import { TestBed } from '@angular/core/testing';

import { QlikService } from './qlik.service';

describe('QlikService', () => {
  let service: QlikService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QlikService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
