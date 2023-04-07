import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditControlSelfAssessmentStatusComponent } from './am-audit-control-self-assessment-status.component';

describe('AmAuditControlSelfAssessmentStatusComponent', () => {
  let component: AmAuditControlSelfAssessmentStatusComponent;
  let fixture: ComponentFixture<AmAuditControlSelfAssessmentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditControlSelfAssessmentStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditControlSelfAssessmentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
