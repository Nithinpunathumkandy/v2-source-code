import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyPerformancesModalComponent } from './strategy-performances-modal.component';

describe('StrategyPerformancesModalComponent', () => {
  let component: StrategyPerformancesModalComponent;
  let fixture: ComponentFixture<StrategyPerformancesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyPerformancesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyPerformancesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
