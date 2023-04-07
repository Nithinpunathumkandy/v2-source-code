import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCategoryModalComponent } from './project-category-modal.component';

describe('ProjectCategoryModalComponent', () => {
  let component: ProjectCategoryModalComponent;
  let fixture: ComponentFixture<ProjectCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
