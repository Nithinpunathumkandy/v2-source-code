import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditReportStatusesComponent } from './audit-report-statuses.component';

describe('AuditReportStatusesComponent', () => {
  let component: AuditReportStatusesComponent;
  let fixture: ComponentFixture<AuditReportStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditReportStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditReportStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
