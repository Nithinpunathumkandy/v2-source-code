import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualPlanByDepartmentAndYearLoaderComponent } from './annual-plan-by-department-and-year-loader.component';

describe('AnnualPlanByDepartmentAndYearLoaderComponent', () => {
  let component: AnnualPlanByDepartmentAndYearLoaderComponent;
  let fixture: ComponentFixture<AnnualPlanByDepartmentAndYearLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualPlanByDepartmentAndYearLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualPlanByDepartmentAndYearLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
