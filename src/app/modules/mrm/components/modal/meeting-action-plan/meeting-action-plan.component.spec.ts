import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingActionPlanComponent } from './meeting-action-plan.component';

describe('MeetingActionPlanComponent', () => {
  let component: MeetingActionPlanComponent;
  let fixture: ComponentFixture<MeetingActionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingActionPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingActionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
