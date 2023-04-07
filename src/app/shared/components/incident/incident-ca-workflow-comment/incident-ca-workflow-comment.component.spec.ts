import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentCaWorkflowCommentComponent } from './incident-ca-workflow-comment.component';

describe('IncidentCaWorkflowCommentComponent', () => {
  let component: IncidentCaWorkflowCommentComponent;
  let fixture: ComponentFixture<IncidentCaWorkflowCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentCaWorkflowCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentCaWorkflowCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
