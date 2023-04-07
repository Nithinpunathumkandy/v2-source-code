import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingObjectiveComponent } from './meeting-objective.component';

describe('MeetingObjectiveComponent', () => {
  let component: MeetingObjectiveComponent;
  let fixture: ComponentFixture<MeetingObjectiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingObjectiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
