import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceWorkflowListComponent } from './compliance-workflow-list.component';

describe('ComplianceWorkflowListComponent', () => {
  let component: ComplianceWorkflowListComponent;
  let fixture: ComponentFixture<ComplianceWorkflowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceWorkflowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceWorkflowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
