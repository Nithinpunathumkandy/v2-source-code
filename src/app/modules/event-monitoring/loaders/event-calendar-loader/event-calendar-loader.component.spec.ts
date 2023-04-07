import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCalendarLoaderComponent } from './event-calendar-loader.component';

describe('EventCalendarLoaderComponent', () => {
  let component: EventCalendarLoaderComponent;
  let fixture: ComponentFixture<EventCalendarLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventCalendarLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCalendarLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
