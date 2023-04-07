import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiCalculationTypesComponent } from './kpi-calculation-types.component';

describe('KpiCalculationTypesComponent', () => {
  let component: KpiCalculationTypesComponent;
  let fixture: ComponentFixture<KpiCalculationTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiCalculationTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiCalculationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
