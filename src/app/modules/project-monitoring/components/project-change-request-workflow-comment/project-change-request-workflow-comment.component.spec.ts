import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectChangeRequestWorkflowCommentComponent } from './project-change-request-workflow-comment.component';

describe('ProjectChangeRequestWorkflowCommentComponent', () => {
  let component: ProjectChangeRequestWorkflowCommentComponent;
  let fixture: ComponentFixture<ProjectChangeRequestWorkflowCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectChangeRequestWorkflowCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectChangeRequestWorkflowCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
