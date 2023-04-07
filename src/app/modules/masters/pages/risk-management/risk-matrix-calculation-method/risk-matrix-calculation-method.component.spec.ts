import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMatrixCalcularionMethodComponent } from './risk-matrix-calcularion-method.component';

describe('RiskMatrixCalcularionMethodComponent', () => {
  let component: RiskMatrixCalcularionMethodComponent;
  let fixture: ComponentFixture<RiskMatrixCalcularionMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskMatrixCalcularionMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskMatrixCalcularionMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
