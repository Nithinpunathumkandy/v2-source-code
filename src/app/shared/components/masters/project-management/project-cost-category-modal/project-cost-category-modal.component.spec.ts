import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCostCategoryModalComponent } from './project-cost-category-modal.component';

describe('ProjectCostCategoryModalComponent', () => {
  let component: ProjectCostCategoryModalComponent;
  let fixture: ComponentFixture<ProjectCostCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectCostCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCostCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
