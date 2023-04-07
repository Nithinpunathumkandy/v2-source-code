import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualPlanFrequenciesComponent } from './annual-plan-frequencies.component';

describe('AnnualPlanFrequenciesComponent', () => {
  let component: AnnualPlanFrequenciesComponent;
  let fixture: ComponentFixture<AnnualPlanFrequenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualPlanFrequenciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualPlanFrequenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
