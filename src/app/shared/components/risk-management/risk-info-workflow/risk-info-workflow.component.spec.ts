import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskInfoWorkflowComponent } from './risk-info-workflow.component';

describe('RiskInfoWorkflowComponent', () => {
  let component: RiskInfoWorkflowComponent;
  let fixture: ComponentFixture<RiskInfoWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskInfoWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskInfoWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
