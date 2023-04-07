import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractAssessmentDetailsComponent } from './contract-assessment-details.component';

describe('ContractAssessmentDetailsComponent', () => {
  let component: ContractAssessmentDetailsComponent;
  let fixture: ComponentFixture<ContractAssessmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractAssessmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractAssessmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
