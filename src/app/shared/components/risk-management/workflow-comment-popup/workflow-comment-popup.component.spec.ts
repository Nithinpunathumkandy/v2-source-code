import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowCommentPopupComponent } from './workflow-comment-popup.component';

describe('WorkflowCommentPopupComponent', () => {
  let component: WorkflowCommentPopupComponent;
  let fixture: ComponentFixture<WorkflowCommentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowCommentPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowCommentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
