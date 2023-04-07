import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningMeetingParticipantsComponent } from './opening-meeting-participants.component';

describe('OpeningMeetingParticipantsComponent', () => {
  let component: OpeningMeetingParticipantsComponent;
  let fixture: ComponentFixture<OpeningMeetingParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpeningMeetingParticipantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeningMeetingParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
