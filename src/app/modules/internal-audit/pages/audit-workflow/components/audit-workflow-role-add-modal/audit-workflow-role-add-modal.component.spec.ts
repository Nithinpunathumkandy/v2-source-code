import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditWorkflowRoleAddModalComponent } from './audit-workflow-role-add-modal.component';

describe('AuditWorkflowRoleAddModalComponent', () => {
  let component: AuditWorkflowRoleAddModalComponent;
  let fixture: ComponentFixture<AuditWorkflowRoleAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditWorkflowRoleAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditWorkflowRoleAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
