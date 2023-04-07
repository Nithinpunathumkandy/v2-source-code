import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractAssessmentDetailsLoaderComponent } from './contract-assessment-details-loader.component';

describe('ContractAssessmentDetailsLoaderComponent', () => {
  let component: ContractAssessmentDetailsLoaderComponent;
  let fixture: ComponentFixture<ContractAssessmentDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractAssessmentDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractAssessmentDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
