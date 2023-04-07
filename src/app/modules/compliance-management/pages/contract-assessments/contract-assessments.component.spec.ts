import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractAssessmentsComponent } from './contract-assessments.component';

describe('ContractAssessmentsComponent', () => {
  let component: ContractAssessmentsComponent;
  let fixture: ComponentFixture<ContractAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractAssessmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
