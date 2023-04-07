import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingActionPlanStatusComponent } from './meeting-action-plan-status.component';

describe('MeetingActionPlanStatusComponent', () => {
  let component: MeetingActionPlanStatusComponent;
  let fixture: ComponentFixture<MeetingActionPlanStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingActionPlanStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingActionPlanStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
