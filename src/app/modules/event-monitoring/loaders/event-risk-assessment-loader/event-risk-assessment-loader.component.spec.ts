import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRiskAssessmentLoaderComponent } from './event-risk-assessment-loader.component';

describe('EventRiskAssessmentLoaderComponent', () => {
  let component: EventRiskAssessmentLoaderComponent;
  let fixture: ComponentFixture<EventRiskAssessmentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventRiskAssessmentLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventRiskAssessmentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
