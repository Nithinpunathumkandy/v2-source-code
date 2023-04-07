import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectChangeRequestWorkflowPopupComponent } from './project-change-request-workflow-popup.component';

describe('ProjectChangeRequestWorkflowPopupComponent', () => {
  let component: ProjectChangeRequestWorkflowPopupComponent;
  let fixture: ComponentFixture<ProjectChangeRequestWorkflowPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectChangeRequestWorkflowPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectChangeRequestWorkflowPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
