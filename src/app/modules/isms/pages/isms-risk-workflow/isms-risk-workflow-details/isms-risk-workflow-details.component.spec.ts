import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskWorkflowDetailsComponent } from './isms-risk-workflow-details.component';

describe('IsmsRiskWorkflowDetailsComponent', () => {
  let component: IsmsRiskWorkflowDetailsComponent;
  let fixture: ComponentFixture<IsmsRiskWorkflowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskWorkflowDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskWorkflowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
