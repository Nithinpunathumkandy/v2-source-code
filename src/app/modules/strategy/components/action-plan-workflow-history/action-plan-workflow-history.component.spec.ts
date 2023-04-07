import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanWorkflowHistoryComponent } from './action-plan-workflow-history.component';

describe('ActionPlanWorkflowHistoryComponent', () => {
  let component: ActionPlanWorkflowHistoryComponent;
  let fixture: ComponentFixture<ActionPlanWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
