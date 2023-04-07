import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatThumbnailPreviewComponent } from './chat-thumbnail-preview.component';

describe('ChatThumbnailPreviewComponent', () => {
  let component: ChatThumbnailPreviewComponent;
  let fixture: ComponentFixture<ChatThumbnailPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatThumbnailPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatThumbnailPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
