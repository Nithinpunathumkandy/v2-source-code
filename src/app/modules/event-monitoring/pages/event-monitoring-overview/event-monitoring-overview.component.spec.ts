import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMonitoringOverviewComponent } from './event-monitoring-overview.component';

describe('EventMonitoringOverviewComponent', () => {
  let component: EventMonitoringOverviewComponent;
  let fixture: ComponentFixture<EventMonitoringOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventMonitoringOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventMonitoringOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
