import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyWorkflowEngineComponent } from './strategy-workflow-engine.component';

describe('StrategyWorkflowEngineComponent', () => {
  let component: StrategyWorkflowEngineComponent;
  let fixture: ComponentFixture<StrategyWorkflowEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyWorkflowEngineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyWorkflowEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
