import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssessmentLoaderComponent } from './risk-assessment-loader.component';

describe('RiskAssessmentLoaderComponent', () => {
  let component: RiskAssessmentLoaderComponent;
  let fixture: ComponentFixture<RiskAssessmentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskAssessmentLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssessmentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
