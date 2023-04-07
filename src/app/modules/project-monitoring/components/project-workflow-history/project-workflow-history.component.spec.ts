import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkflowHistoryComponent } from './project-workflow-history.component';

describe('ProjectWorkflowHistoryComponent', () => {
  let component: ProjectWorkflowHistoryComponent;
  let fixture: ComponentFixture<ProjectWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
