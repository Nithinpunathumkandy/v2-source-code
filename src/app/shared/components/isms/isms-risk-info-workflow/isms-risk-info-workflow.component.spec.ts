import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskInfoWorkflowComponent } from './isms-risk-info-workflow.component';

describe('IsmsRiskInfoWorkflowComponent', () => {
  let component: IsmsRiskInfoWorkflowComponent;
  let fixture: ComponentFixture<IsmsRiskInfoWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskInfoWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskInfoWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
