import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDocumentReviewHistoryLoaderComponent } from './master-document-review-history-loader.component';

describe('MasterDocumentReviewHistoryLoaderComponent', () => {
  let component: MasterDocumentReviewHistoryLoaderComponent;
  let fixture: ComponentFixture<MasterDocumentReviewHistoryLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDocumentReviewHistoryLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDocumentReviewHistoryLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
