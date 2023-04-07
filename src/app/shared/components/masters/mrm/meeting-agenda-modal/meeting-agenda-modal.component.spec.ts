import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAgendaModalComponent } from './meeting-agenda-modal.component';

describe('MeetingAgendaModalComponent', () => {
  let component: MeetingAgendaModalComponent;
  let fixture: ComponentFixture<MeetingAgendaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingAgendaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingAgendaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
