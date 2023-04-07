import { TestBed } from '@angular/core/testing';

import { BcmTemplateService } from './bcm-template.service';

describe('BcmTemplateService', () => {
  let service: BcmTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcmTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
