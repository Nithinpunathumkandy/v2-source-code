import { TestBed } from '@angular/core/testing';

import { MasterMenuService } from './master-menu.service';

describe('MasterMenuService', () => {
  let service: MasterMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
