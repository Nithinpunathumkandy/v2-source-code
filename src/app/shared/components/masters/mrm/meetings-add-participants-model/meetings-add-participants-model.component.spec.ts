import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsAddParticipantsModelComponent } from './meetings-add-participants-model.component';

describe('MeetingsAddParticipantsModelComponent', () => {
  let component: MeetingsAddParticipantsModelComponent;
  let fixture: ComponentFixture<MeetingsAddParticipantsModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingsAddParticipantsModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingsAddParticipantsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
