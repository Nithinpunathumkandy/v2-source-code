import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRiskJourneyComponent } from './event-risk-journey.component';

describe('EventRiskJourneyComponent', () => {
  let component: EventRiskJourneyComponent;
  let fixture: ComponentFixture<EventRiskJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventRiskJourneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventRiskJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
