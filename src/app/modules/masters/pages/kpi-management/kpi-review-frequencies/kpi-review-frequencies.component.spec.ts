import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiReviewFrequenciesComponent } from './kpi-review-frequencies.component';

describe('KpiReviewFrequenciesComponent', () => {
  let component: KpiReviewFrequenciesComponent;
  let fixture: ComponentFixture<KpiReviewFrequenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiReviewFrequenciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiReviewFrequenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
