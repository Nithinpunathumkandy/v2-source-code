import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentWorkflowCommentPopupComponent } from './incident-workflow-comment-popup.component';

describe('IncidentWorkflowCommentPopupComponent', () => {
  let component: IncidentWorkflowCommentPopupComponent;
  let fixture: ComponentFixture<IncidentWorkflowCommentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentWorkflowCommentPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentWorkflowCommentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
