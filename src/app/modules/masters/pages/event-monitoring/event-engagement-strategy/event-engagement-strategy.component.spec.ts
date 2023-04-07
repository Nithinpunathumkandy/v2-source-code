import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventEngagementStrategyComponent } from './event-engagement-strategy.component';

describe('EventEngagementStrategyComponent', () => {
  let component: EventEngagementStrategyComponent;
  let fixture: ComponentFixture<EventEngagementStrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventEngagementStrategyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventEngagementStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
