import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBcmRiskTreatmentComponent } from './add-bcm-risk-treatment.component';

describe('AddBcmRiskTreatmentComponent', () => {
  let component: AddBcmRiskTreatmentComponent;
  let fixture: ComponentFixture<AddBcmRiskTreatmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBcmRiskTreatmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBcmRiskTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
