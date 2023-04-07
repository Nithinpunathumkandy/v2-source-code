import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyInitiativeMilestoneStatusComponent } from './strategy-initiative-milestone-status.component';

describe('StrategyInitiativeMilestoneStatusComponent', () => {
  let component: StrategyInitiativeMilestoneStatusComponent;
  let fixture: ComponentFixture<StrategyInitiativeMilestoneStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyInitiativeMilestoneStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyInitiativeMilestoneStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
