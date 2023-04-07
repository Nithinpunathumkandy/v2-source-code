import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNewPlanScheduleComponent } from './edit-new-plan-schedule.component';

describe('EditNewPlanScheduleComponent', () => {
  let component: EditNewPlanScheduleComponent;
  let fixture: ComponentFixture<EditNewPlanScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNewPlanScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNewPlanScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
