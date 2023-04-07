import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCostCategoryComponent } from './project-cost-category.component';

describe('ProjectCostCategoryComponent', () => {
  let component: ProjectCostCategoryComponent;
  let fixture: ComponentFixture<ProjectCostCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectCostCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCostCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
