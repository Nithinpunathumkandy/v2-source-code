import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskWorkflowHistoryComponent } from './isms-risk-workflow-history.component';

describe('IsmsRiskWorkflowHistoryComponent', () => {
  let component: IsmsRiskWorkflowHistoryComponent;
  let fixture: ComponentFixture<IsmsRiskWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
