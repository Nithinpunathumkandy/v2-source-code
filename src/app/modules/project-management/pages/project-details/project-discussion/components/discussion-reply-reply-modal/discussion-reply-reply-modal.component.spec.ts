import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionReplyReplyModalComponent } from './discussion-reply-reply-modal.component';

describe('DiscussionReplyReplyModalComponent', () => {
  let component: DiscussionReplyReplyModalComponent;
  let fixture: ComponentFixture<DiscussionReplyReplyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscussionReplyReplyModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionReplyReplyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
