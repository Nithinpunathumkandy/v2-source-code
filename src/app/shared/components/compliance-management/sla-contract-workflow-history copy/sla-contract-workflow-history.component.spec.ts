import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaContractWorkflowHistoryComponent } from './sla-contract-workflow-history.component';

describe('SlaContractWorkflowHistoryComponent', () => {
  let component: SlaContractWorkflowHistoryComponent;
  let fixture: ComponentFixture<SlaContractWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaContractWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaContractWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
