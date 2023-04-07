import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentReportDetailComponent } from './incident-report-detail.component';

describe('IncidentReportDetailComponent', () => {
  let component: IncidentReportDetailComponent;
  let fixture: ComponentFixture<IncidentReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentReportDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
