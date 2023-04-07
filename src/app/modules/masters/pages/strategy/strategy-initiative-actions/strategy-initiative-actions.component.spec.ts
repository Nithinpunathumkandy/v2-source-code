import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyInitiativeActionsComponent } from './strategy-initiative-actions.component';

describe('StrategyInitiativeActionsComponent', () => {
  let component: StrategyInitiativeActionsComponent;
  let fixture: ComponentFixture<StrategyInitiativeActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyInitiativeActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyInitiativeActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
