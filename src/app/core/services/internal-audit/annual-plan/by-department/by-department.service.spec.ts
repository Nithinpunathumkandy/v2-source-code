import { TestBed } from '@angular/core/testing';

import { ByDepartmentService } from './by-department.service';

describe('ByDepartmentService', () => {
  let service: ByDepartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ByDepartmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
