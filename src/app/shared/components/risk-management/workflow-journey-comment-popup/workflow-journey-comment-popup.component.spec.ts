import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowJourneyCommentPopupComponent } from './workflow-journey-comment-popup.component';

describe('WorkflowJourneyCommentPopupComponent', () => {
  let component: WorkflowJourneyCommentPopupComponent;
  let fixture: ComponentFixture<WorkflowJourneyCommentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowJourneyCommentPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowJourneyCommentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
