import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessAssessmentFrequenciesComponent } from './business-assessment-frequencies.component';

describe('BusinessAssessmentFrequenciesComponent', () => {
  let component: BusinessAssessmentFrequenciesComponent;
  let fixture: ComponentFixture<BusinessAssessmentFrequenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessAssessmentFrequenciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessAssessmentFrequenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
