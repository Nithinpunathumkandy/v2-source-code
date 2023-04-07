import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventEngagementStrategyModalComponent } from './event-engagement-strategy-modal.component';

describe('EventEngagementStrategyModalComponent', () => {
  let component: EventEngagementStrategyModalComponent;
  let fixture: ComponentFixture<EventEngagementStrategyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventEngagementStrategyModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventEngagementStrategyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
