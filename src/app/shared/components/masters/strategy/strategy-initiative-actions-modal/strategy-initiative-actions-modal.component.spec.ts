import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyInitiativeActionsModalComponent } from './strategy-initiative-actions-modal.component';

describe('StrategyInitiativeActionsModalComponent', () => {
  let component: StrategyInitiativeActionsModalComponent;
  let fixture: ComponentFixture<StrategyInitiativeActionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyInitiativeActionsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyInitiativeActionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
