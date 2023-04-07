import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIsmsRiskTreatmentComponent } from './edit-isms-risk-treatment.component';

describe('EditIsmsRiskTreatmentComponent', () => {
  let component: EditIsmsRiskTreatmentComponent;
  let fixture: ComponentFixture<EditIsmsRiskTreatmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIsmsRiskTreatmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIsmsRiskTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
