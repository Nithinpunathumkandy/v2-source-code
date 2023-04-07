import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMonitoringDashboardLoaderComponent } from './project-monitoring-dashboard-loader.component';

describe('ProjectMonitoringDashboardLoaderComponent', () => {
  let component: ProjectMonitoringDashboardLoaderComponent;
  let fixture: ComponentFixture<ProjectMonitoringDashboardLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectMonitoringDashboardLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMonitoringDashboardLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
