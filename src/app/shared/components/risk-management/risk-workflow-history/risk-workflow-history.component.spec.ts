import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskWorkflowHistoryComponent } from './risk-workflow-history.component';

describe('RiskWorkflowHistoryComponent', () => {
  let component: RiskWorkflowHistoryComponent;
  let fixture: ComponentFixture<RiskWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
