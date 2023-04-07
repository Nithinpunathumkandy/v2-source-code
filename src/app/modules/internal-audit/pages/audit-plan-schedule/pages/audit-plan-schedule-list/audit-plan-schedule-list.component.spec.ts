import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanScheduleListComponent } from './audit-plan-schedule-list.component';

describe('AuditPlanScheduleListComponent', () => {
  let component: AuditPlanScheduleListComponent;
  let fixture: ComponentFixture<AuditPlanScheduleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditPlanScheduleListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPlanScheduleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
