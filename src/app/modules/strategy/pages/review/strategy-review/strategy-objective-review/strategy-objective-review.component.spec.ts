import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyObjectiveReviewComponent } from './strategy-objective-review.component';

describe('StrategyObjectiveReviewComponent', () => {
  let component: StrategyObjectiveReviewComponent;
  let fixture: ComponentFixture<StrategyObjectiveReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyObjectiveReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyObjectiveReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
