import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBudgetLoaderComponent } from './project-budget-loader.component';

describe('ProjectBudgetLoaderComponent', () => {
  let component: ProjectBudgetLoaderComponent;
  let fixture: ComponentFixture<ProjectBudgetLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectBudgetLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectBudgetLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
