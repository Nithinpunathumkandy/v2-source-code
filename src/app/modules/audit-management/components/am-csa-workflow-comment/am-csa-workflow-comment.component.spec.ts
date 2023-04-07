import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmCsaWorkflowCommentComponent } from './am-csa-workflow-comment.component';

describe('AmCsaWorkflowCommentComponent', () => {
  let component: AmCsaWorkflowCommentComponent;
  let fixture: ComponentFixture<AmCsaWorkflowCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmCsaWorkflowCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmCsaWorkflowCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
