import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditProgramReportUpdateModalComponent } from './audit-program-report-update-modal.component';

describe('AuditProgramReportUpdateModalComponent', () => {
  let component: AuditProgramReportUpdateModalComponent;
  let fixture: ComponentFixture<AuditProgramReportUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditProgramReportUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditProgramReportUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
