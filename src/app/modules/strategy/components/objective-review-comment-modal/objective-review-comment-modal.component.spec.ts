import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveReviewCommentModalComponent } from './objective-review-comment-modal.component';

describe('ObjectiveReviewCommentModalComponent', () => {
  let component: ObjectiveReviewCommentModalComponent;
  let fixture: ComponentFixture<ObjectiveReviewCommentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectiveReviewCommentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveReviewCommentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
