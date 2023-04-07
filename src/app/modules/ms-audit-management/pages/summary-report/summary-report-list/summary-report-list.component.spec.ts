import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryReportListComponent } from './summary-report-list.component';

describe('SummaryReportListComponent', () => {
  let component: SummaryReportListComponent;
  let fixture: ComponentFixture<SummaryReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryReportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
