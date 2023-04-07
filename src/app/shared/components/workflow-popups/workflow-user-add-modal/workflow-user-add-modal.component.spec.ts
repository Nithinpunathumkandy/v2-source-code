import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowUserAddModalComponent } from './workflow-user-add-modal.component';

describe('WorkflowUserAddModalComponent', () => {
  let component: WorkflowUserAddModalComponent;
  let fixture: ComponentFixture<WorkflowUserAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowUserAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowUserAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
