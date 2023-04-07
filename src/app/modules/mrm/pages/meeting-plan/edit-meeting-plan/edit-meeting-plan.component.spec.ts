import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMeetingPlanComponent } from './edit-meeting-plan.component';

describe('EditMeetingPlanComponent', () => {
  let component: EditMeetingPlanComponent;
  let fixture: ComponentFixture<EditMeetingPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMeetingPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMeetingPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
