import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpWorkflowCommentComponent } from './bcp-workflow-comment.component';

describe('BcpWorkflowCommentComponent', () => {
  let component: BcpWorkflowCommentComponent;
  let fixture: ComponentFixture<BcpWorkflowCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpWorkflowCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpWorkflowCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
