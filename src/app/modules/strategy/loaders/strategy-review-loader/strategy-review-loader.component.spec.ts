import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyReviewLoaderComponent } from './strategy-review-loader.component';

describe('StrategyReviewLoaderComponent', () => {
  let component: StrategyReviewLoaderComponent;
  let fixture: ComponentFixture<StrategyReviewLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyReviewLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyReviewLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
