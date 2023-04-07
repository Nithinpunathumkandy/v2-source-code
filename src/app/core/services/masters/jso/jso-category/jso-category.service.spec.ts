import { TestBed } from '@angular/core/testing';

import { JsoCategoryService } from './jso-category.service';

describe('JsoCategoryService', () => {
  let service: JsoCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsoCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
