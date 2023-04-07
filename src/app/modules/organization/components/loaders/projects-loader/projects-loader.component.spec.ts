import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsLoaderComponent } from './projects-loader.component';

describe('ProjectsLoaderComponent', () => {
  let component: ProjectsLoaderComponent;
  let fixture: ComponentFixture<ProjectsLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
