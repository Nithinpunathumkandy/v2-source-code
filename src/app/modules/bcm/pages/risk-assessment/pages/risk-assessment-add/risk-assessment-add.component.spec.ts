import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssessmentAddComponent } from './risk-assessment-add.component';

describe('RiskAssessmentAddComponent', () => {
  let component: RiskAssessmentAddComponent;
  let fixture: ComponentFixture<RiskAssessmentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskAssessmentAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssessmentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
