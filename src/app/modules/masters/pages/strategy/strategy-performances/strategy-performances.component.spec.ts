import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyPerformancesComponent } from './strategy-performances.component';

describe('StrategyPerformancesComponent', () => {
  let component: StrategyPerformancesComponent;
  let fixture: ComponentFixture<StrategyPerformancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyPerformancesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyPerformancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
