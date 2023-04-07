import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAuditPlanScheduleComponent } from './edit-audit-plan-schedule.component';

describe('EditAuditPlanScheduleComponent', () => {
  let component: EditAuditPlanScheduleComponent;
  let fixture: ComponentFixture<EditAuditPlanScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAuditPlanScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAuditPlanScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
