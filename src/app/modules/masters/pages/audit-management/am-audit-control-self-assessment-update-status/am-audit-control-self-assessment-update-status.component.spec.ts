import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditControlSelfAssessmentUpdateStatusComponent } from './am-audit-control-self-assessment-update-status.component';

describe('AmAuditControlSelfAssessmentUpdateStatusComponent', () => {
  let component: AmAuditControlSelfAssessmentUpdateStatusComponent;
  let fixture: ComponentFixture<AmAuditControlSelfAssessmentUpdateStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditControlSelfAssessmentUpdateStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditControlSelfAssessmentUpdateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
