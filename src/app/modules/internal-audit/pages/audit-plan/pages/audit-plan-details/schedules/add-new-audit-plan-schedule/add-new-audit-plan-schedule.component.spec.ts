import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAuditPlanScheduleComponent } from './add-new-audit-plan-schedule.component';

describe('AddNewAuditPlanScheduleComponent', () => {
  let component: AddNewAuditPlanScheduleComponent;
  let fixture: ComponentFixture<AddNewAuditPlanScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewAuditPlanScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewAuditPlanScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
