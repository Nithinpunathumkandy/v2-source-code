import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRiskTreatmentComponent } from './add-risk-treatment.component';

describe('AddRiskTreatmentComponent', () => {
  let component: AddRiskTreatmentComponent;
  let fixture: ComponentFixture<AddRiskTreatmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRiskTreatmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRiskTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
