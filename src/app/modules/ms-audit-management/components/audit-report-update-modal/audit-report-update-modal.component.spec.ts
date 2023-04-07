import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditReportUpdateModalComponent } from './audit-report-update-modal.component';

describe('AuditReportUpdateModalComponent', () => {
  let component: AuditReportUpdateModalComponent;
  let fixture: ComponentFixture<AuditReportUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditReportUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditReportUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
