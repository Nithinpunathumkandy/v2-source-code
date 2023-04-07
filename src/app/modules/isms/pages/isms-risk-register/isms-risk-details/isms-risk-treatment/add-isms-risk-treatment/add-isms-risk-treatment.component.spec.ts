import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIsmsRiskTreatmentComponent } from './add-isms-risk-treatment.component';

describe('AddIsmsRiskTreatmentComponent', () => {
  let component: AddIsmsRiskTreatmentComponent;
  let fixture: ComponentFixture<AddIsmsRiskTreatmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIsmsRiskTreatmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIsmsRiskTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
