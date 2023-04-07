import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowModalComponent } from './workflow-modal.component';

describe('WorkflowModalComponent', () => {
  let component: WorkflowModalComponent;
  let fixture: ComponentFixture<WorkflowModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
