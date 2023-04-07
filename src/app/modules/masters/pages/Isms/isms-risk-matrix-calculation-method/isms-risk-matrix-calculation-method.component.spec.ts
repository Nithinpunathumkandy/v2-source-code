import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskMatrixCalculationMethodComponent } from './isms-risk-matrix-calculation-method.component';

describe('IsmsRiskMatrixCalculationMethodComponent', () => {
  let component: IsmsRiskMatrixCalculationMethodComponent;
  let fixture: ComponentFixture<IsmsRiskMatrixCalculationMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskMatrixCalculationMethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskMatrixCalculationMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
