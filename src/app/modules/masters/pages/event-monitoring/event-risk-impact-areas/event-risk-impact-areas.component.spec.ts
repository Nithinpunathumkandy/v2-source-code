import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRiskImpactAreasComponent } from './event-risk-impact-areas.component';

describe('EventRiskImpactAreasComponent', () => {
  let component: EventRiskImpactAreasComponent;
  let fixture: ComponentFixture<EventRiskImpactAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventRiskImpactAreasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventRiskImpactAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
