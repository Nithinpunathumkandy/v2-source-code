import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkflowListComponent } from './project-workflow-list.component';

describe('ProjectWorkflowListComponent', () => {
  let component: ProjectWorkflowListComponent;
  let fixture: ComponentFixture<ProjectWorkflowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectWorkflowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectWorkflowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
