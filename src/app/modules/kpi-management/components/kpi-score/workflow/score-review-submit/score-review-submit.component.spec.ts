import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreReviewSubmitComponent } from './score-review-submit.component';

describe('ScoreReviewSubmitComponent', () => {
  let component: ScoreReviewSubmitComponent;
  let fixture: ComponentFixture<ScoreReviewSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreReviewSubmitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreReviewSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
