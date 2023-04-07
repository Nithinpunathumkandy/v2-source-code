import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessAssessmentAssessmentsComponent } from './business-assessment-assessments.component';

describe('BusinessAssessmentAssessmentsComponent', () => {
  let component: BusinessAssessmentAssessmentsComponent;
  let fixture: ComponentFixture<BusinessAssessmentAssessmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessAssessmentAssessmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessAssessmentAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
