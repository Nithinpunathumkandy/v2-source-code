import { TestBed } from '@angular/core/testing';

import { RightSidebarFilterService } from './right-sidebar-filter.service';

describe('RightSidebarFilterService', () => {
  let service: RightSidebarFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RightSidebarFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
