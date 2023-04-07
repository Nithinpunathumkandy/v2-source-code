import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskJourneyWorkflowHistoryComponent } from './isms-risk-journey-workflow-history.component';

describe('IsmsRiskJourneyWorkflowHistoryComponent', () => {
  let component: IsmsRiskJourneyWorkflowHistoryComponent;
  let fixture: ComponentFixture<IsmsRiskJourneyWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskJourneyWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskJourneyWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
