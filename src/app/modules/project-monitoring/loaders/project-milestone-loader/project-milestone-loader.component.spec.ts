import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMilestoneLoaderComponent } from './project-milestone-loader.component';

describe('ProjectMilestoneLoaderComponent', () => {
  let component: ProjectMilestoneLoaderComponent;
  let fixture: ComponentFixture<ProjectMilestoneLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectMilestoneLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMilestoneLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
