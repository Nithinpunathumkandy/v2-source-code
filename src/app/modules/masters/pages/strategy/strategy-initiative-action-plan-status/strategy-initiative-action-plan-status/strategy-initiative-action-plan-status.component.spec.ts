import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyInitiativeActionPlanStatusComponent } from './strategy-initiative-action-plan-status.component';

describe('StrategyInitiativeActionPlanStatusComponent', () => {
  let component: StrategyInitiativeActionPlanStatusComponent;
  let fixture: ComponentFixture<StrategyInitiativeActionPlanStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyInitiativeActionPlanStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyInitiativeActionPlanStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
