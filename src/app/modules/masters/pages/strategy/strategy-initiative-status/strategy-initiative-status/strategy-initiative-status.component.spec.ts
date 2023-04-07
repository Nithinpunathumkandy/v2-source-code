import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyInitiativeStatusComponent } from './strategy-initiative-status.component';

describe('StrategyInitiativeStatusComponent', () => {
  let component: StrategyInitiativeStatusComponent;
  let fixture: ComponentFixture<StrategyInitiativeStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyInitiativeStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyInitiativeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
