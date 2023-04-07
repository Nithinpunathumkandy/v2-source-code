import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingReportTemplatesComponent } from './meeting-report-templates.component';

describe('MeetingReportTemplatesComponent', () => {
  let component: MeetingReportTemplatesComponent;
  let fixture: ComponentFixture<MeetingReportTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingReportTemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingReportTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
