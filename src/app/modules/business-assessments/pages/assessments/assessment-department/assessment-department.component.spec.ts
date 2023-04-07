import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentDepartmentComponent } from './assessment-department.component';

describe('AssessmentDepartmentComponent', () => {
  let component: AssessmentDepartmentComponent;
  let fixture: ComponentFixture<AssessmentDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
