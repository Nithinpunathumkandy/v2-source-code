import { TestBed } from '@angular/core/testing';

import { RootCauseCategoriesService } from './root-cause-categories.service';

describe('RootCauseCategoriesService', () => {
  let service: RootCauseCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RootCauseCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
