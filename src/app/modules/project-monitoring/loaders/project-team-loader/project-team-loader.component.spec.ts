import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTeamLoaderComponent } from './project-team-loader.component';

describe('ProjectTeamLoaderComponent', () => {
  let component: ProjectTeamLoaderComponent;
  let fixture: ComponentFixture<ProjectTeamLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectTeamLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTeamLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
