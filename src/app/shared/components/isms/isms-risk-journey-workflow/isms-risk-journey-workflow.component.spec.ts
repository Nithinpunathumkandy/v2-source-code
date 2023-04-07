import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskJourneyWorkflowComponent } from './isms-risk-journey-workflow.component';

describe('IsmsRiskJourneyWorkflowComponent', () => {
  let component: IsmsRiskJourneyWorkflowComponent;
  let fixture: ComponentFixture<IsmsRiskJourneyWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskJourneyWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskJourneyWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
