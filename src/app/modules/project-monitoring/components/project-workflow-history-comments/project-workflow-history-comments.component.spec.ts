import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkflowHistoryCommentsComponent } from './project-workflow-history-comments.component';

describe('ProjectWorkflowHistoryCommentsComponent', () => {
  let component: ProjectWorkflowHistoryCommentsComponent;
  let fixture: ComponentFixture<ProjectWorkflowHistoryCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectWorkflowHistoryCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectWorkflowHistoryCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
