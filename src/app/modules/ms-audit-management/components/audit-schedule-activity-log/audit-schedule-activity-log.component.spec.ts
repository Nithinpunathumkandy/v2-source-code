import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditScheduleActivityLogComponent } from './audit-schedule-activity-log.component';

describe('AuditScheduleActivityLogComponent', () => {
  let component: AuditScheduleActivityLogComponent;
  let fixture: ComponentFixture<AuditScheduleActivityLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditScheduleActivityLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditScheduleActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
