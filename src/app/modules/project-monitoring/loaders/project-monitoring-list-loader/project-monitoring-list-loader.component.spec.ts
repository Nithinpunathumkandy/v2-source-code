import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMonitoringListLoaderComponent } from './project-monitoring-list-loader.component';

describe('ProjectMonitoringListLoaderComponent', () => {
  let component: ProjectMonitoringListLoaderComponent;
  let fixture: ComponentFixture<ProjectMonitoringListLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectMonitoringListLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMonitoringListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
