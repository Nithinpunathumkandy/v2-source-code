import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditReportLoaderComponent } from './audit-report-loader.component';

describe('AuditReportLoaderComponent', () => {
  let component: AuditReportLoaderComponent;
  let fixture: ComponentFixture<AuditReportLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditReportLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditReportLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
