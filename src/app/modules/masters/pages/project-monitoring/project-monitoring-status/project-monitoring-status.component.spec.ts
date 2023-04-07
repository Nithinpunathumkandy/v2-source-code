import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMonitoringStatusComponent } from './project-monitoring-status.component';

describe('ProjectMonitoringStatusComponent', () => {
  let component: ProjectMonitoringStatusComponent;
  let fixture: ComponentFixture<ProjectMonitoringStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectMonitoringStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMonitoringStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
