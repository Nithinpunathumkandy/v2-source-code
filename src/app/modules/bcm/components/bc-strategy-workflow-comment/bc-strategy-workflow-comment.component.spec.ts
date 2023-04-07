import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcStrategyWorkflowCommentComponent } from './bc-strategy-workflow-comment.component';

describe('BcStrategyWorkflowCommentComponent', () => {
  let component: BcStrategyWorkflowCommentComponent;
  let fixture: ComponentFixture<BcStrategyWorkflowCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcStrategyWorkflowCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcStrategyWorkflowCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
