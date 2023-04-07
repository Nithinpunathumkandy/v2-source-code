import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditWorkflowAddModalComponent } from './audit-workflow-add-modal.component';

describe('AuditWorkflowAddModalComponent', () => {
  let component: AuditWorkflowAddModalComponent;
  let fixture: ComponentFixture<AuditWorkflowAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditWorkflowAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditWorkflowAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
