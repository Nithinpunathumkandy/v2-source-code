import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkflowPopupComponent } from './project-workflow-popup.component';

describe('ProjectWorkflowPopupComponent', () => {
  let component: ProjectWorkflowPopupComponent;
  let fixture: ComponentFixture<ProjectWorkflowPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectWorkflowPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectWorkflowPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
