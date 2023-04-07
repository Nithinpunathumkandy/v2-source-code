import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanWorkflowCommentComponent } from './action-plan-workflow-comment.component';

describe('ActionPlanWorkflowCommentComponent', () => {
  let component: ActionPlanWorkflowCommentComponent;
  let fixture: ComponentFixture<ActionPlanWorkflowCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanWorkflowCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanWorkflowCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
