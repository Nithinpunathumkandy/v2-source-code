import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDocumentReviewHistoryComponent } from './master-document-review-history.component';

describe('MasterDocumentReviewHistoryComponent', () => {
  let component: MasterDocumentReviewHistoryComponent;
  let fixture: ComponentFixture<MasterDocumentReviewHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDocumentReviewHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDocumentReviewHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
