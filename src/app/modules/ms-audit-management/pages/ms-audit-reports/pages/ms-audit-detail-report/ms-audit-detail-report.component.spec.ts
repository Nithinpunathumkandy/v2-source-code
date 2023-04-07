import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditDetailReportComponent } from './ms-audit-detail-report.component';

describe('MsAuditDetailReportComponent', () => {
  let component: MsAuditDetailReportComponent;
  let fixture: ComponentFixture<MsAuditDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditDetailReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
