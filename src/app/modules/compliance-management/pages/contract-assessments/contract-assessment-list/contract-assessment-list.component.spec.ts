import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractAssessmentListComponent } from './contract-assessment-list.component';

describe('ContractAssessmentListComponent', () => {
  let component: ContractAssessmentListComponent;
  let fixture: ComponentFixture<ContractAssessmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractAssessmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractAssessmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
