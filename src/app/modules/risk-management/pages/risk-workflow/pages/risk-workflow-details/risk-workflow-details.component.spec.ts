import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskWorkflowDetailsComponent } from './risk-workflow-details.component';

describe('RiskWorkflowDetailsComponent', () => {
  let component: RiskWorkflowDetailsComponent;
  let fixture: ComponentFixture<RiskWorkflowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskWorkflowDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskWorkflowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
