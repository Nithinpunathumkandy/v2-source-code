import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUnplannedMeetingComponent } from './edit-unplanned-meeting.component';

describe('EditUnplannedMeetingComponent', () => {
  let component: EditUnplannedMeetingComponent;
  let fixture: ComponentFixture<EditUnplannedMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUnplannedMeetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUnplannedMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
