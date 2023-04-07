import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiReviewMeasureAllHistoryComponent } from './kpi-review-measure-all-history.component';

describe('KpiReviewMeasureAllHistoryComponent', () => {
  let component: KpiReviewMeasureAllHistoryComponent;
  let fixture: ComponentFixture<KpiReviewMeasureAllHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiReviewMeasureAllHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiReviewMeasureAllHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
