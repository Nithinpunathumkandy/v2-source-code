import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceWorkflowComponent } from './compliance-workflow.component';

describe('ComplianceWorkflowComponent', () => {
  let component: ComplianceWorkflowComponent;
  let fixture: ComponentFixture<ComplianceWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
