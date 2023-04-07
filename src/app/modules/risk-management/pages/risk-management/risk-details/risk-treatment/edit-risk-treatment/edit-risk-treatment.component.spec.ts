import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRiskTreatmentComponent } from './edit-risk-treatment.component';

describe('EditRiskTreatmentComponent', () => {
  let component: EditRiskTreatmentComponent;
  let fixture: ComponentFixture<EditRiskTreatmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRiskTreatmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRiskTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
