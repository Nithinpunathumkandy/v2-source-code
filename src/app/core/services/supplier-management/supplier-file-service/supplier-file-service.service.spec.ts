import { TestBed } from '@angular/core/testing';

import { SupplierFileServiceService } from './supplier-file-service.service';

describe('SupplierFileServiceService', () => {
  let service: SupplierFileServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierFileServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
