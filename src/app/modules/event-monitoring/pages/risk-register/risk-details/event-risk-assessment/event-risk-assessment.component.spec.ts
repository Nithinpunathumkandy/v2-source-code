import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRiskAssessmentComponent } from './event-risk-assessment.component';

describe('EventRiskAssessmentComponent', () => {
  let component: EventRiskAssessmentComponent;
  let fixture: ComponentFixture<EventRiskAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventRiskAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventRiskAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
