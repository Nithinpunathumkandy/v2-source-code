import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsReportComponent } from './meetings-report.component';

describe('MeetingsReportComponent', () => {
  let component: MeetingsReportComponent;
  let fixture: ComponentFixture<MeetingsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
