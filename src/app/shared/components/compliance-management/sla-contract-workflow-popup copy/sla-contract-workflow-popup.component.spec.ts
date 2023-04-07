import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaContractWorkflowPopupComponent } from './sla-contract-workflow-popup.component';

describe('SlaContractWorkflowPopupComponent', () => {
  let component: SlaContractWorkflowPopupComponent;
  let fixture: ComponentFixture<SlaContractWorkflowPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaContractWorkflowPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaContractWorkflowPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
