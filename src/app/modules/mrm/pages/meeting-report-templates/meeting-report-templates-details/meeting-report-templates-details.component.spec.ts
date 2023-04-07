import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingReportTemplatesDetailsComponent } from './meeting-report-templates-details.component';

describe('MeetingReportTemplatesDetailsComponent', () => {
  let component: MeetingReportTemplatesDetailsComponent;
  let fixture: ComponentFixture<MeetingReportTemplatesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingReportTemplatesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingReportTemplatesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
