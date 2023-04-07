import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMeetingPlanComponent } from './add-meeting-plan.component';

describe('AddMeetingPlanComponent', () => {
  let component: AddMeetingPlanComponent;
  let fixture: ComponentFixture<AddMeetingPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMeetingPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMeetingPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
