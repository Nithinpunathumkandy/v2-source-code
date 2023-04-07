import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMilestoneComponent } from './strategy-milestone.component';

describe('StrategyMilestoneComponent', () => {
  let component: StrategyMilestoneComponent;
  let fixture: ComponentFixture<StrategyMilestoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMilestoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMilestoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
