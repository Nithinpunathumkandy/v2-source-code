import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskTreatmentComponent } from './isms-risk-treatment.component';

describe('IsmsRiskTreatmentComponent', () => {
  let component: IsmsRiskTreatmentComponent;
  let fixture: ComponentFixture<IsmsRiskTreatmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskTreatmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
