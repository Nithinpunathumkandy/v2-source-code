import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMonitoringMappingComponent } from './project-monitoring-mapping.component';

describe('ProjectMonitoringMappingComponent', () => {
  let component: ProjectMonitoringMappingComponent;
  let fixture: ComponentFixture<ProjectMonitoringMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectMonitoringMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMonitoringMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
