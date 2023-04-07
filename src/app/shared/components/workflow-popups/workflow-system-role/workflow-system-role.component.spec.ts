import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowSystemRoleComponent } from './workflow-system-role.component';

describe('WorkflowSystemRoleComponent', () => {
  let component: WorkflowSystemRoleComponent;
  let fixture: ComponentFixture<WorkflowSystemRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowSystemRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowSystemRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
