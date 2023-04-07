import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyReviewComponent } from './strategy-review.component';

describe('StrategyReviewComponent', () => {
  let component: StrategyReviewComponent;
  let fixture: ComponentFixture<StrategyReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
