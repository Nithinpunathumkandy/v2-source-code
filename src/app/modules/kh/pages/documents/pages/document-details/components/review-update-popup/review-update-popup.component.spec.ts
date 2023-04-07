import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewUpdatePopupComponent } from './review-update-popup.component';

describe('ReviewUpdatePopupComponent', () => {
  let component: ReviewUpdatePopupComponent;
  let fixture: ComponentFixture<ReviewUpdatePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewUpdatePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewUpdatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
