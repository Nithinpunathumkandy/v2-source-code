import { TestBed } from '@angular/core/testing';

import { JsoDashboardService } from './jso-dashboard.service';

describe('JsoDashboardService', () => {
  let service: JsoDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsoDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
