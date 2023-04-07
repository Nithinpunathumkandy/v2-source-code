import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsWorkflowCommentPopupComponent } from './isms-workflow-comment-popup.component';

describe('IsmsWorkflowCommentPopupComponent', () => {
  let component: IsmsWorkflowCommentPopupComponent;
  let fixture: ComponentFixture<IsmsWorkflowCommentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsWorkflowCommentPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsWorkflowCommentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
