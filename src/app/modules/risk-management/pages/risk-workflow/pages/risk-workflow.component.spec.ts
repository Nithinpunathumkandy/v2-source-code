import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskWorkflowComponent } from './risk-workflow.component';

describe('RiskWorkflowComponent', () => {
  let component: RiskWorkflowComponent;
  let fixture: ComponentFixture<RiskWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
