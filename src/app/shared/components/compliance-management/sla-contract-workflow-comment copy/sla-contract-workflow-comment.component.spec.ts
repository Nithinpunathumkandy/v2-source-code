import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaContractWorkflowCommentComponent } from './sla-contract-workflow-comment.component';

describe('SlaContractWorkflowCommentComponent', () => {
  let component: SlaContractWorkflowCommentComponent;
  let fixture: ComponentFixture<SlaContractWorkflowCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaContractWorkflowCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaContractWorkflowCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
