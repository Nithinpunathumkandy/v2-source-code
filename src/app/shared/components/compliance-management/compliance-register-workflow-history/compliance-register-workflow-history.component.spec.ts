import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceRegisterWorkflowHistoryComponent } from './compliance-register-workflow-history.component';

describe('ComplianceRegisterWorkflowHistoryComponent', () => {
  let component: ComplianceRegisterWorkflowHistoryComponent;
  let fixture: ComponentFixture<ComplianceRegisterWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceRegisterWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceRegisterWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
