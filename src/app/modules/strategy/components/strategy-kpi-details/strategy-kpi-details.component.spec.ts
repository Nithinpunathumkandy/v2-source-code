import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyKpiDetailsComponent } from './strategy-kpi-details.component';

describe('StrategyKpiDetailsComponent', () => {
  let component: StrategyKpiDetailsComponent;
  let fixture: ComponentFixture<StrategyKpiDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyKpiDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyKpiDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
