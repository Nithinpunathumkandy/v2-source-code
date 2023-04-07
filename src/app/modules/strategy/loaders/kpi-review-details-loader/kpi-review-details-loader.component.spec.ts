import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiReviewDetailsLoaderComponent } from './kpi-review-details-loader.component';

describe('KpiReviewDetailsLoaderComponent', () => {
  let component: KpiReviewDetailsLoaderComponent;
  let fixture: ComponentFixture<KpiReviewDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiReviewDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiReviewDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
