import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAgendaLoopComponent } from './meeting-agenda-loop.component';

describe('MeetingAgendaLoopComponent', () => {
  let component: MeetingAgendaLoopComponent;
  let fixture: ComponentFixture<MeetingAgendaLoopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingAgendaLoopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingAgendaLoopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
