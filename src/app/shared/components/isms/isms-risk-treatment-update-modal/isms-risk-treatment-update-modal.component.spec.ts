import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskTreatmentUpdateModalComponent } from './isms-risk-treatment-update-modal.component';

describe('IsmsRiskTreatmentUpdateModalComponent', () => {
  let component: IsmsRiskTreatmentUpdateModalComponent;
  let fixture: ComponentFixture<IsmsRiskTreatmentUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskTreatmentUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskTreatmentUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
