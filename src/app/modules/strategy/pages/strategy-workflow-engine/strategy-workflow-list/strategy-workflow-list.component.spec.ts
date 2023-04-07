import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyWorkflowListComponent } from './strategy-workflow-list.component';

describe('StrategyWorkflowListComponent', () => {
  let component: StrategyWorkflowListComponent;
  let fixture: ComponentFixture<StrategyWorkflowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyWorkflowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyWorkflowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
