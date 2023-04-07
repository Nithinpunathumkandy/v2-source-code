import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRiskAssessmentModelComponent } from './event-risk-assessment-model.component';

describe('EventRiskAssessmentModelComponent', () => {
  let component: EventRiskAssessmentModelComponent;
  let fixture: ComponentFixture<EventRiskAssessmentModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventRiskAssessmentModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventRiskAssessmentModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
