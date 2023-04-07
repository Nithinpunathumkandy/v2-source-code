import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditScheduleStatusesComponent } from './ms-audit-schedule-statuses.component';

describe('MsAuditScheduleStatusesComponent', () => {
  let component: MsAuditScheduleStatusesComponent;
  let fixture: ComponentFixture<MsAuditScheduleStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditScheduleStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditScheduleStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
