import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContractAssessmentModalComponent } from './add-contract-assessment-modal.component';

describe('AddContractAssessmentModalComponent', () => {
  let component: AddContractAssessmentModalComponent;
  let fixture: ComponentFixture<AddContractAssessmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddContractAssessmentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContractAssessmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
