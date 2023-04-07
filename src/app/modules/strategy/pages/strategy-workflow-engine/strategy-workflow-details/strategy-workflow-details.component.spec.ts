import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyWorkflowDetailsComponent } from './strategy-workflow-details.component';

describe('StrategyWorkflowDetailsComponent', () => {
  let component: StrategyWorkflowDetailsComponent;
  let fixture: ComponentFixture<StrategyWorkflowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyWorkflowDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyWorkflowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
