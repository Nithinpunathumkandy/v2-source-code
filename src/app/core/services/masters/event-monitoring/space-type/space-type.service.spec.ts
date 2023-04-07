import { TestBed } from '@angular/core/testing';

import { SpaceTypeService } from './space-type.service';

describe('SpaceTypeService', () => {
  let service: SpaceTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaceTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
