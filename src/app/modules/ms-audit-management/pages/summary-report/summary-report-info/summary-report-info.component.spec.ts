import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryReportInfoComponent } from './summary-report-info.component';

describe('SummaryReportInfoComponent', () => {
  let component: SummaryReportInfoComponent;
  let fixture: ComponentFixture<SummaryReportInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryReportInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryReportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
