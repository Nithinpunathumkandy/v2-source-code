import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventClosureDashboardComponent } from './event-closure-dashboard.component';

describe('EventClosureDashboardComponent', () => {
  let component: EventClosureDashboardComponent;
  let fixture: ComponentFixture<EventClosureDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventClosureDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventClosureDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
