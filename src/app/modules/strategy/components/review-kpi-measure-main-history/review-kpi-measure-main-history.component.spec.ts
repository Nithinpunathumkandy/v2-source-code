import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewKpiMeasureMainHistoryComponent } from './review-kpi-measure-main-history.component';

describe('ReviewKpiMeasureMainHistoryComponent', () => {
  let component: ReviewKpiMeasureMainHistoryComponent;
  let fixture: ComponentFixture<ReviewKpiMeasureMainHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewKpiMeasureMainHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewKpiMeasureMainHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
