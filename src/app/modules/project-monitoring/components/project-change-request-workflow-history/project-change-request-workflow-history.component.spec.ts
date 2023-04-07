import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectChangeRequestWorkflowHistoryComponent } from './project-change-request-workflow-history.component';

describe('ProjectChangeRequestWorkflowHistoryComponent', () => {
  let component: ProjectChangeRequestWorkflowHistoryComponent;
  let fixture: ComponentFixture<ProjectChangeRequestWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectChangeRequestWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectChangeRequestWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
