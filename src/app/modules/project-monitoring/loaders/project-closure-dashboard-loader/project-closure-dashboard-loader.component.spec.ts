import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectClosureDashboardLoaderComponent } from './project-closure-dashboard-loader.component';

describe('ProjectClosureDashboardLoaderComponent', () => {
  let component: ProjectClosureDashboardLoaderComponent;
  let fixture: ComponentFixture<ProjectClosureDashboardLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectClosureDashboardLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectClosureDashboardLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
