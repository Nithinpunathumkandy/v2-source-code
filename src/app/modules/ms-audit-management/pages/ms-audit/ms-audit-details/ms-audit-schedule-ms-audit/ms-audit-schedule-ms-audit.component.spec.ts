import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditScheduleMsAuditComponent } from './ms-audit-schedule-ms-audit.component';

describe('MsAuditScheduleMsAuditComponent', () => {
  let component: MsAuditScheduleMsAuditComponent;
  let fixture: ComponentFixture<MsAuditScheduleMsAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditScheduleMsAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditScheduleMsAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
