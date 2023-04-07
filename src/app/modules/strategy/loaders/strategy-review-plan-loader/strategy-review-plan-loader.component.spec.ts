import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyReviewPlanLoaderComponent } from './strategy-review-plan-loader.component';

describe('StrategyReviewPlanLoaderComponent', () => {
  let component: StrategyReviewPlanLoaderComponent;
  let fixture: ComponentFixture<StrategyReviewPlanLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyReviewPlanLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyReviewPlanLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
