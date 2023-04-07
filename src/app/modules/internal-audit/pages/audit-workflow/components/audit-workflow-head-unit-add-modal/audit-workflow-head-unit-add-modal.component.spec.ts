import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditWorkflowHeadUnitAddModalComponent } from './audit-workflow-head-unit-add-modal.component';

describe('AuditWorkflowHeadUnitAddModalComponent', () => {
  let component: AuditWorkflowHeadUnitAddModalComponent;
  let fixture: ComponentFixture<AuditWorkflowHeadUnitAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditWorkflowHeadUnitAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditWorkflowHeadUnitAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
