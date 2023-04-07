import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmStrategyWorkflowComponent } from './bcm-strategy-workflow.component';

describe('BcmStrategyWorkflowComponent', () => {
  let component: BcmStrategyWorkflowComponent;
  let fixture: ComponentFixture<BcmStrategyWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcmStrategyWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcmStrategyWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
