import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectIssueCategoryLoaderComponent } from './project-issue-category-loader.component';

describe('ProjectIssueCategoryLoaderComponent', () => {
  let component: ProjectIssueCategoryLoaderComponent;
  let fixture: ComponentFixture<ProjectIssueCategoryLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectIssueCategoryLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectIssueCategoryLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
