import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceReportingStatusComponent } from './compliance-reporting-status.component';

describe('ComplianceReportingStatusComponent', () => {
  let component: ComplianceReportingStatusComponent;
  let fixture: ComponentFixture<ComplianceReportingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceReportingStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceReportingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
