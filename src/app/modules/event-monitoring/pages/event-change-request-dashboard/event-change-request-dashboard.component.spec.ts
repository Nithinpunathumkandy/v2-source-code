import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventChangeRequestDashboardComponent } from './event-change-request-dashboard.component';

describe('EventChangeRequestDashboardComponent', () => {
  let component: EventChangeRequestDashboardComponent;
  let fixture: ComponentFixture<EventChangeRequestDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventChangeRequestDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventChangeRequestDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
