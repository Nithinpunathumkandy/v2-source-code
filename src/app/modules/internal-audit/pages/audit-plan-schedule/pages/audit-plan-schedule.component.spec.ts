import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanScheduleComponent } from './audit-plan-schedule.component';

describe('AuditPlanScheduleComponent', () => {
  let component: AuditPlanScheduleComponent;
  let fixture: ComponentFixture<AuditPlanScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditPlanScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPlanScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
