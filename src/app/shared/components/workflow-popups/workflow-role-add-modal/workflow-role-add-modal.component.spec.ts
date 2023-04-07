import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowRoleAddModalComponent } from './workflow-role-add-modal.component';

describe('WorkflowRoleAddModalComponent', () => {
  let component: WorkflowRoleAddModalComponent;
  let fixture: ComponentFixture<WorkflowRoleAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowRoleAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowRoleAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
