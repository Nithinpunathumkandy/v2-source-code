import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessRiskAssessmentLoaderComponent } from './process-risk-assessment-loader.component';

describe('ProcessRiskAssessmentLoaderComponent', () => {
  let component: ProcessRiskAssessmentLoaderComponent;
  let fixture: ComponentFixture<ProcessRiskAssessmentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessRiskAssessmentLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessRiskAssessmentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
