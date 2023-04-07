import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcStrategyWorkflowHistoryComponent } from './bc-strategy-workflow-history.component';

describe('BcStrategyWorkflowHistoryComponent', () => {
  let component: BcStrategyWorkflowHistoryComponent;
  let fixture: ComponentFixture<BcStrategyWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcStrategyWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcStrategyWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
