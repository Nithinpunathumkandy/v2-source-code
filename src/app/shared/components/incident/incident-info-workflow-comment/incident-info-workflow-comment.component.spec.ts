import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentInfoWorkflowCommentComponent } from './incident-info-workflow-comment.component';

describe('IncidentInfoWorkflowCommentComponent', () => {
  let component: IncidentInfoWorkflowCommentComponent;
  let fixture: ComponentFixture<IncidentInfoWorkflowCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentInfoWorkflowCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentInfoWorkflowCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
