import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingPlanAddParticipantsModalComponent } from './meeting-plan-add-participants-modal.component';

describe('MeetingPlanAddParticipantsModalComponent', () => {
  let component: MeetingPlanAddParticipantsModalComponent;
  let fixture: ComponentFixture<MeetingPlanAddParticipantsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingPlanAddParticipantsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingPlanAddParticipantsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
