import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditReportDetailsComponent } from './ms-audit-report-details.component';

describe('MsAuditReportDetailsComponent', () => {
  let component: MsAuditReportDetailsComponent;
  let fixture: ComponentFixture<MsAuditReportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditReportDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
