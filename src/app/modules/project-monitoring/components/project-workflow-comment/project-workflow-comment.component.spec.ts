import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkflowCommentComponent } from './project-workflow-comment.component';

describe('ProjectWorkflowCommentComponent', () => {
  let component: ProjectWorkflowCommentComponent;
  let fixture: ComponentFixture<ProjectWorkflowCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectWorkflowCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectWorkflowCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
