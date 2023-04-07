import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyDashboardInitiativeLoaderComponent } from './strategy-dashboard-initiative-loader.component';

describe('StrategyDashboardInitiativeLoaderComponent', () => {
  let component: StrategyDashboardInitiativeLoaderComponent;
  let fixture: ComponentFixture<StrategyDashboardInitiativeLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyDashboardInitiativeLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyDashboardInitiativeLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
