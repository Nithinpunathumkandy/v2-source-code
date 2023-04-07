import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentDepartmentLoaderComponent } from './assessment-department-loader.component';

describe('AssessmentDepartmentLoaderComponent', () => {
  let component: AssessmentDepartmentLoaderComponent;
  let fixture: ComponentFixture<AssessmentDepartmentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentDepartmentLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentDepartmentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
