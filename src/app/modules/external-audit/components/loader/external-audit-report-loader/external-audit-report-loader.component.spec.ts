import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalAuditReportLoaderComponent } from './external-audit-report-loader.component';

describe('ExternalAuditReportLoaderComponent', () => {
  let component: ExternalAuditReportLoaderComponent;
  let fixture: ComponentFixture<ExternalAuditReportLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalAuditReportLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalAuditReportLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
