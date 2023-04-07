import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditReportTypeComponent } from './am-audit-report-type.component';

describe('AmAuditReportTypeComponent', () => {
  let component: AmAuditReportTypeComponent;
  let fixture: ComponentFixture<AmAuditReportTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditReportTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditReportTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
