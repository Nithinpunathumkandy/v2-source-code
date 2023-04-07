import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAuditPlanScheduleComponent } from './add-audit-plan-schedule.component';

describe('AddAuditPlanScheduleComponent', () => {
  let component: AddAuditPlanScheduleComponent;
  let fixture: ComponentFixture<AddAuditPlanScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAuditPlanScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAuditPlanScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
