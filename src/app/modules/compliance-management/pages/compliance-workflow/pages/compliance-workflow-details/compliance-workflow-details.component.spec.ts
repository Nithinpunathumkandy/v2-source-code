import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceWorkflowDetailsComponent } from './compliance-workflow-details.component';

describe('ComplianceWorkflowDetailsComponent', () => {
  let component: ComplianceWorkflowDetailsComponent;
  let fixture: ComponentFixture<ComplianceWorkflowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceWorkflowDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceWorkflowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
