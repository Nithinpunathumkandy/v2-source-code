import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentDetailReportComponent } from './cyber-incident-detail-report.component';

describe('CyberIncidentDetailReportComponent', () => {
  let component: CyberIncidentDetailReportComponent;
  let fixture: ComponentFixture<CyberIncidentDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentDetailReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
