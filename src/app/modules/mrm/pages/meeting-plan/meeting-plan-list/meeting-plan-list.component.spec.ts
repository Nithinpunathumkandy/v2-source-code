import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingPlanListComponent } from './meeting-plan-list.component';

describe('MeetingPlanListComponent', () => {
  let component: MeetingPlanListComponent;
  let fixture: ComponentFixture<MeetingPlanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingPlanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
