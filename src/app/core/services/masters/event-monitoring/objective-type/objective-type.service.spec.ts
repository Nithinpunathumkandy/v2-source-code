import { TestBed } from '@angular/core/testing';

import { ObjectiveTypeService } from './objective-type.service';

describe('ObjectiveTypeService', () => {
  let service: ObjectiveTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectiveTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
