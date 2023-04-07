import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAllReviewModalComponent } from './add-all-review-modal.component';

describe('AddAllReviewModalComponent', () => {
  let component: AddAllReviewModalComponent;
  let fixture: ComponentFixture<AddAllReviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAllReviewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAllReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
