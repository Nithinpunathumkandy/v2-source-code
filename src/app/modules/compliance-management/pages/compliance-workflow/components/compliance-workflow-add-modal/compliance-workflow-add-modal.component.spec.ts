import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceWorkflowAddModalComponent } from './compliance-workflow-add-modal.component';

describe('ComplianceWorkflowAddModalComponent', () => {
  let component: ComplianceWorkflowAddModalComponent;
  let fixture: ComponentFixture<ComplianceWorkflowAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceWorkflowAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceWorkflowAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
