import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectScopeOfWorkLoaderComponent } from './project-scope-of-work-loader.component';

describe('ProjectScopeOfWorkLoaderComponent', () => {
  let component: ProjectScopeOfWorkLoaderComponent;
  let fixture: ComponentFixture<ProjectScopeOfWorkLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectScopeOfWorkLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectScopeOfWorkLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
