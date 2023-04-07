import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMeetingMinutesComponent } from './preview-meeting-minutes.component';

describe('PreviewMeetingMinutesComponent', () => {
  let component: PreviewMeetingMinutesComponent;
  let fixture: ComponentFixture<PreviewMeetingMinutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewMeetingMinutesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewMeetingMinutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
