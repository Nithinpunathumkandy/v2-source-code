import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditWorkflowDesignationAddModalComponent } from './audit-workflow-designation-add-modal.component';

describe('AuditWorkflowDesignationAddModalComponent', () => {
  let component: AuditWorkflowDesignationAddModalComponent;
  let fixture: ComponentFixture<AuditWorkflowDesignationAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditWorkflowDesignationAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditWorkflowDesignationAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
