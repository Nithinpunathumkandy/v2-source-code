import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditWorkflowUserAddModalComponent } from './audit-workflow-user-add-modal.component';

describe('AuditWorkflowUserAddModalComponent', () => {
  let component: AuditWorkflowUserAddModalComponent;
  let fixture: ComponentFixture<AuditWorkflowUserAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditWorkflowUserAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditWorkflowUserAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
