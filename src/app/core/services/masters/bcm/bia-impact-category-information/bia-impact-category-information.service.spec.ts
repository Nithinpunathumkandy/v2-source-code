import { TestBed } from '@angular/core/testing';

import { BiaImpactCategoryInformationService } from './bia-impact-category-information.service';

describe('BiaImpactCategoryInformationService', () => {
  let service: BiaImpactCategoryInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiaImpactCategoryInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
