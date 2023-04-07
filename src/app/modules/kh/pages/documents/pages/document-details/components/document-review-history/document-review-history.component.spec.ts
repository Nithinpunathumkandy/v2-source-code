import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentReviewHistoryComponent } from './document-review-history.component';

describe('DocumentReviewHistoryComponent', () => {
  let component: DocumentReviewHistoryComponent;
  let fixture: ComponentFixture<DocumentReviewHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentReviewHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentReviewHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
