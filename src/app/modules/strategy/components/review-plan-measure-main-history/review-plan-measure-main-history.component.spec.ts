import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPlanMeasureMainHistoryComponent } from './review-plan-measure-main-history.component';

describe('ReviewPlanMeasureMainHistoryComponent', () => {
  let component: ReviewPlanMeasureMainHistoryComponent;
  let fixture: ComponentFixture<ReviewPlanMeasureMainHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewPlanMeasureMainHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewPlanMeasureMainHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
