import { TestBed } from '@angular/core/testing';

import { ModuleGroupsService } from './module-groups.service';

describe('ModuleGroupsService', () => {
  let service: ModuleGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
