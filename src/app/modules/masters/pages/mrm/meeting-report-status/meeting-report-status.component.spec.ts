import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingReportStatusComponent } from './meeting-report-status.component';

describe('MeetingReportStatusComponent', () => {
  let component: MeetingReportStatusComponent;
  let fixture: ComponentFixture<MeetingReportStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingReportStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingReportStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
