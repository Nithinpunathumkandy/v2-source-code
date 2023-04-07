import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowActionPopupComponent } from './workflow-action-popup.component';

describe('WorkflowActionPopupComponent', () => {
  let component: WorkflowActionPopupComponent;
  let fixture: ComponentFixture<WorkflowActionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowActionPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowActionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
