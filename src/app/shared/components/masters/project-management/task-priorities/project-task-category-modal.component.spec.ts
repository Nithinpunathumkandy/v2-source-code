import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTaskCategoryModalComponent } from './project-task-category-modal.component';

describe('ProjectTaskCategoryModalComponent', () => {
  let component: ProjectTaskCategoryModalComponent;
  let fixture: ComponentFixture<ProjectTaskCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectTaskCategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTaskCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
