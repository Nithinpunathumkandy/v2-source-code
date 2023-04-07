import { TestBed } from '@angular/core/testing';

import { KnTemplatesService } from './kn-templates.service';

describe('KnTemplatesService', () => {
  let service: KnTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KnTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
