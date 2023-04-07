import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDesignationModalComponent } from './workflow-designation-modal.component';

describe('WorkflowDesignationModalComponent', () => {
  let component: WorkflowDesignationModalComponent;
  let fixture: ComponentFixture<WorkflowDesignationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowDesignationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowDesignationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
