import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskReviewFrequencyComponent } from './risk-review-frequency.component';

describe('RiskReviewFrequencyComponent', () => {
  let component: RiskReviewFrequencyComponent;
  let fixture: ComponentFixture<RiskReviewFrequencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskReviewFrequencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskReviewFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
