import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentReportDetailsComponent } from './cyber-incident-report-details.component';

describe('CyberIncidentReportDetailsComponent', () => {
  let component: CyberIncidentReportDetailsComponent;
  let fixture: ComponentFixture<CyberIncidentReportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentReportDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
