import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyObjectivePlanComponent } from './strategy-objective-plan.component';

describe('StrategyObjectivePlanComponent', () => {
  let component: StrategyObjectivePlanComponent;
  let fixture: ComponentFixture<StrategyObjectivePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyObjectivePlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyObjectivePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
