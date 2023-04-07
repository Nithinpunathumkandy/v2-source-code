import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMonitoringWorkflowEngineComponent } from './project-monitoring-workflow-engine.component';

describe('ProjectMonitoringWorkflowEngineComponent', () => {
  let component: ProjectMonitoringWorkflowEngineComponent;
  let fixture: ComponentFixture<ProjectMonitoringWorkflowEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectMonitoringWorkflowEngineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMonitoringWorkflowEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
