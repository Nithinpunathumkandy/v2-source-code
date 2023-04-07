import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingReportTemplatesAddComponent } from './meeting-report-templates-add.component';

describe('MeetingReportTemplatesAddComponent', () => {
  let component: MeetingReportTemplatesAddComponent;
  let fixture: ComponentFixture<MeetingReportTemplatesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingReportTemplatesAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingReportTemplatesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
