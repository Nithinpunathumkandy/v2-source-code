import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskWorkflowComponent } from './isms-risk-workflow.component';

describe('IsmsRiskWorkflowComponent', () => {
  let component: IsmsRiskWorkflowComponent;
  let fixture: ComponentFixture<IsmsRiskWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
