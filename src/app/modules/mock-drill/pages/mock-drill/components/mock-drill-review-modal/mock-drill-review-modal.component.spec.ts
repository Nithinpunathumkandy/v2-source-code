import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillReviewModalComponent } from './mock-drill-review-modal.component';

describe('MockDrillReviewModalComponent', () => {
  let component: MockDrillReviewModalComponent;
  let fixture: ComponentFixture<MockDrillReviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillReviewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
