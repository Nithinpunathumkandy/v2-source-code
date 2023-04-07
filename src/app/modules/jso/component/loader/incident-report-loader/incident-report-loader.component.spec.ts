import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentReportLoaderComponent } from './incident-report-loader.component';

describe('IncidentReportLoaderComponent', () => {
  let component: IncidentReportLoaderComponent;
  let fixture: ComponentFixture<IncidentReportLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentReportLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentReportLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
