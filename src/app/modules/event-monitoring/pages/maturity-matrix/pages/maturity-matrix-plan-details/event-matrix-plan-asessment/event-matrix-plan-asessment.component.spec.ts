import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMatrixPlanAsessmentComponent } from './event-matrix-plan-asessment.component';

describe('EventMatrixPlanAsessmentComponent', () => {
  let component: EventMatrixPlanAsessmentComponent;
  let fixture: ComponentFixture<EventMatrixPlanAsessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventMatrixPlanAsessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventMatrixPlanAsessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
