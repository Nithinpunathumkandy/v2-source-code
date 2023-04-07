import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingReportTemplatesListComponent } from './meeting-report-templates-list.component';

describe('MeetingReportTemplatesListComponent', () => {
  let component: MeetingReportTemplatesListComponent;
  let fixture: ComponentFixture<MeetingReportTemplatesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingReportTemplatesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingReportTemplatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
