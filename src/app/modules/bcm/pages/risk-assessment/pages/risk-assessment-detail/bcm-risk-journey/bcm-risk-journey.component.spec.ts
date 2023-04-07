import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmRiskJourneyComponent } from './bcm-risk-journey.component';

describe('BcmRiskJourneyComponent', () => {
  let component: BcmRiskJourneyComponent;
  let fixture: ComponentFixture<BcmRiskJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcmRiskJourneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcmRiskJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
