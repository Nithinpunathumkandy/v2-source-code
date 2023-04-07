import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskWorkflowListComponent } from './isms-risk-workflow-list.component';

describe('IsmsRiskWorkflowListComponent', () => {
  let component: IsmsRiskWorkflowListComponent;
  let fixture: ComponentFixture<IsmsRiskWorkflowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskWorkflowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskWorkflowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
