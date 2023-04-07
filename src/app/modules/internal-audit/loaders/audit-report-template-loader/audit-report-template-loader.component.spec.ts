import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditReportTemplateLoaderComponent } from './audit-report-template-loader.component';

describe('AuditReportTemplateLoaderComponent', () => {
  let component: AuditReportTemplateLoaderComponent;
  let fixture: ComponentFixture<AuditReportTemplateLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditReportTemplateLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditReportTemplateLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
