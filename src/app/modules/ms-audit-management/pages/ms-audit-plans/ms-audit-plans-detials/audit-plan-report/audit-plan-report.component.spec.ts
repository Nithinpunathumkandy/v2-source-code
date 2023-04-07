import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanReportComponent } from './audit-plan-report.component';

describe('AuditPlanReportComponent', () => {
  let component: AuditPlanReportComponent;
  let fixture: ComponentFixture<AuditPlanReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditPlanReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPlanReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
