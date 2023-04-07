import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskJourneyWorkflowHistoryComponent } from './risk-journey-workflow-history.component';

describe('RiskJourneyWorkflowHistoryComponent', () => {
  let component: RiskJourneyWorkflowHistoryComponent;
  let fixture: ComponentFixture<RiskJourneyWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskJourneyWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskJourneyWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
