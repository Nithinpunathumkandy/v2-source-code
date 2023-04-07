import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionRepliesModalComponent } from './discussion-replies-modal.component';

describe('DiscussionRepliesModalComponent', () => {
  let component: DiscussionRepliesModalComponent;
  let fixture: ComponentFixture<DiscussionRepliesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscussionRepliesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionRepliesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
