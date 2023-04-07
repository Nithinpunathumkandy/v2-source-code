import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingPlanStatusComponent } from './meeting-plan-status.component';

describe('MeetingPlanStatusComponent', () => {
  let component: MeetingPlanStatusComponent;
  let fixture: ComponentFixture<MeetingPlanStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingPlanStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingPlanStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
