import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentReportListComponent } from './incident-report-list.component';

describe('IncidentReportListComponent', () => {
  let component: IncidentReportListComponent;
  let fixture: ComponentFixture<IncidentReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentReportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
