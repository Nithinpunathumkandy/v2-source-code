import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDocumentPreviewComponent } from './event-document-preview.component';

describe('EventDocumentPreviewComponent', () => {
  let component: EventDocumentPreviewComponent;
  let fixture: ComponentFixture<EventDocumentPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventDocumentPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDocumentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
