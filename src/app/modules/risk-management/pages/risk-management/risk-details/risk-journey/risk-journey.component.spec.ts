import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskJourneyComponent } from './risk-journey.component';

describe('RiskJourneyComponent', () => {
  let component: RiskJourneyComponent;
  let fixture: ComponentFixture<RiskJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskJourneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
