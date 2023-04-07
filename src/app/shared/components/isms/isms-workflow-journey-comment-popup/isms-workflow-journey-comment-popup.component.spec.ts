import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsWorkflowJourneyCommentPopupComponent } from './isms-workflow-journey-comment-popup.component';

describe('IsmsWorkflowJourneyCommentPopupComponent', () => {
  let component: IsmsWorkflowJourneyCommentPopupComponent;
  let fixture: ComponentFixture<IsmsWorkflowJourneyCommentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsWorkflowJourneyCommentPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsWorkflowJourneyCommentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
