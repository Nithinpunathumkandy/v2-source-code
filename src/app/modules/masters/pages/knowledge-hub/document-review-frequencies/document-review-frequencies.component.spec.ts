import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentReviewFrequenciesComponent } from './document-review-frequencies.component';

describe('DocumentReviewFrequenciesComponent', () => {
  let component: DocumentReviewFrequenciesComponent;
  let fixture: ComponentFixture<DocumentReviewFrequenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentReviewFrequenciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentReviewFrequenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
