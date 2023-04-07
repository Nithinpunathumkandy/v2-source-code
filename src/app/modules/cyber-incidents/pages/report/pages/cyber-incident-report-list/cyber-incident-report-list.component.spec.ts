import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentReportListComponent } from './cyber-incident-report-list.component';

describe('CyberIncidentReportListComponent', () => {
  let component: CyberIncidentReportListComponent;
  let fixture: ComponentFixture<CyberIncidentReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentReportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
