import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTaskCategoryComponent } from './project-task-category.component';

describe('ProjectTaskCategoryComponent', () => {
  let component: ProjectTaskCategoryComponent;
  let fixture: ComponentFixture<ProjectTaskCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectTaskCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTaskCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
