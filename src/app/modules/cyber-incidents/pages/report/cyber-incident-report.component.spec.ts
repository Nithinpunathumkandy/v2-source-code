import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentReportComponent } from './cyber-incident-report.component';

describe('CyberIncidentReportComponent', () => {
  let component: CyberIncidentReportComponent;
  let fixture: ComponentFixture<CyberIncidentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
