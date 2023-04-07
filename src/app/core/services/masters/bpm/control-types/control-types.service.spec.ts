import { TestBed } from '@angular/core/testing';

import { ControlTypesService } from './control-types.service';

describe('ControlTypesService', () => {
  let service: ControlTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
