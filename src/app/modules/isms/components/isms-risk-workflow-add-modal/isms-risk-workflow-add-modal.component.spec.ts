import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskWorkflowAddModalComponent } from './isms-risk-workflow-add-modal.component';

describe('IsmsRiskWorkflowAddModalComponent', () => {
  let component: IsmsRiskWorkflowAddModalComponent;
  let fixture: ComponentFixture<IsmsRiskWorkflowAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskWorkflowAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskWorkflowAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
