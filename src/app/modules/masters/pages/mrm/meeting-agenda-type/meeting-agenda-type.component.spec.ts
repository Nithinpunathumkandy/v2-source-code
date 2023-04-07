import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAgendaTypeComponent } from './meeting-agenda-type.component';

describe('MeetingAgendaTypeComponent', () => {
  let component: MeetingAgendaTypeComponent;
  let fixture: ComponentFixture<MeetingAgendaTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingAgendaTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingAgendaTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
