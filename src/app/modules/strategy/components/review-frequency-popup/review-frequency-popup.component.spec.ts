import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFrequencyPopupComponent } from './review-frequency-popup.component';

describe('ReviewFrequencyPopupComponent', () => {
  let component: ReviewFrequencyPopupComponent;
  let fixture: ComponentFixture<ReviewFrequencyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewFrequencyPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFrequencyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
