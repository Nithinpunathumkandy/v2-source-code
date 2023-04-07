import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditReportListComponent } from './ms-audit-report-list.component';

describe('MsAuditReportListComponent', () => {
  let component: MsAuditReportListComponent;
  let fixture: ComponentFixture<MsAuditReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditReportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
