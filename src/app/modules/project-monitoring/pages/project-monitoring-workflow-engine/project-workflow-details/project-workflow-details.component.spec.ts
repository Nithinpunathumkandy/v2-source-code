import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkflowDetailsComponent } from './project-workflow-details.component';

describe('ProjectWorkflowDetailsComponent', () => {
  let component: ProjectWorkflowDetailsComponent;
  let fixture: ComponentFixture<ProjectWorkflowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectWorkflowDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectWorkflowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
