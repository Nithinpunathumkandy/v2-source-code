import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssessmentEditComponent } from './risk-assessment-edit.component';

describe('RiskAssessmentEditComponent', () => {
  let component: RiskAssessmentEditComponent;
  let fixture: ComponentFixture<RiskAssessmentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskAssessmentEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssessmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
