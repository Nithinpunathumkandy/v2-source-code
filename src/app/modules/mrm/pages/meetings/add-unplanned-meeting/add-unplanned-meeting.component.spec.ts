import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnplannedMeetingComponent } from './add-unplanned-meeting.component';

describe('AddUnplannedMeetingComponent', () => {
  let component: AddUnplannedMeetingComponent;
  let fixture: ComponentFixture<AddUnplannedMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUnplannedMeetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUnplannedMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
