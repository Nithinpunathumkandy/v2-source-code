import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingPlanDetailsComponent } from './meeting-plan-details.component';

describe('MeetingPlanDetailsComponent', () => {
  let component: MeetingPlanDetailsComponent;
  let fixture: ComponentFixture<MeetingPlanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingPlanDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
