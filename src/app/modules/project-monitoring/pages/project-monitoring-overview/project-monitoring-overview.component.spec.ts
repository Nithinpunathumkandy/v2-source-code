import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMonitoringOverviewComponent } from './project-monitoring-overview.component';

describe('ProjectMonitoringOverviewComponent', () => {
  let component: ProjectMonitoringOverviewComponent;
  let fixture: ComponentFixture<ProjectMonitoringOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectMonitoringOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMonitoringOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
