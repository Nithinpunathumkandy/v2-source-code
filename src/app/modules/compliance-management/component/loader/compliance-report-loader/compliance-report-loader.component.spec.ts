import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceReportLoaderComponent } from './compliance-report-loader.component';

describe('ComplianceReportLoaderComponent', () => {
  let component: ComplianceReportLoaderComponent;
  let fixture: ComponentFixture<ComplianceReportLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceReportLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceReportLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
