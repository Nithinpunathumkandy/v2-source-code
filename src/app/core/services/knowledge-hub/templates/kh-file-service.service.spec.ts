import { TestBed } from '@angular/core/testing';

import { KhFileServiceService } from './kh-file-service.service';

describe('KhFileServiceService', () => {
  let service: KhFileServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KhFileServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
