import { TestBed } from '@angular/core/testing';

import { IncidentCategoriesService } from './incident-categories.service';

describe('IncidentCategoriesService', () => {
  let service: IncidentCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
