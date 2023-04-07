import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceRegisterWorkflowPopupComponent } from './compliance-register-workflow-popup.component';

describe('ComplianceRegisterWorkflowPopupComponent', () => {
  let component: ComplianceRegisterWorkflowPopupComponent;
  let fixture: ComponentFixture<ComplianceRegisterWorkflowPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceRegisterWorkflowPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceRegisterWorkflowPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
