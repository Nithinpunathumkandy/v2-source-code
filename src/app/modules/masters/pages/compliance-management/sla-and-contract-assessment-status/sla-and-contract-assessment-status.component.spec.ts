import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaAndContractAssessmentStatusComponent } from './sla-and-contract-assessment-status.component';

describe('SlaAndContractAssessmentStatusComponent', () => {
  let component: SlaAndContractAssessmentStatusComponent;
  let fixture: ComponentFixture<SlaAndContractAssessmentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaAndContractAssessmentStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaAndContractAssessmentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
