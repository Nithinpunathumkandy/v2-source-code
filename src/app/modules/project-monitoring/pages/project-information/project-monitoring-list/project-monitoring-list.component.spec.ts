import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMonitoringListComponent } from './project-monitoring-list.component';

describe('ProjectMonitoringListComponent', () => {
  let component: ProjectMonitoringListComponent;
  let fixture: ComponentFixture<ProjectMonitoringListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectMonitoringListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMonitoringListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
