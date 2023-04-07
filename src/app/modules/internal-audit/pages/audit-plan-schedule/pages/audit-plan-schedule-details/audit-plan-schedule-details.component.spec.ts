import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanScheduleDetailsComponent } from './audit-plan-schedule-details.component';

describe('AuditPlanScheduleDetailsComponent', () => {
  let component: AuditPlanScheduleDetailsComponent;
  let fixture: ComponentFixture<AuditPlanScheduleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditPlanScheduleDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPlanScheduleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
