import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskJourneyWorkflowComponent } from './risk-journey-workflow.component';

describe('RiskJourneyWorkflowComponent', () => {
  let component: RiskJourneyWorkflowComponent;
  let fixture: ComponentFixture<RiskJourneyWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskJourneyWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskJourneyWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
