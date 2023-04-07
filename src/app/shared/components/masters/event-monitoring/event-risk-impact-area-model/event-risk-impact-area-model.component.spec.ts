import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRiskImpactAreaModelComponent } from './event-risk-impact-area-model.component';

describe('EventRiskImpactAreaModelComponent', () => {
  let component: EventRiskImpactAreaModelComponent;
  let fixture: ComponentFixture<EventRiskImpactAreaModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventRiskImpactAreaModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventRiskImpactAreaModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
