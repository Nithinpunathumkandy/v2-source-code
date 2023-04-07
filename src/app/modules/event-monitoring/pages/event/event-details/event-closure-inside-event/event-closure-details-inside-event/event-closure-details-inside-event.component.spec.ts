import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventClosureDetailsInsideEventComponent } from './event-closure-details-inside-event.component';

describe('EventClosureDetailsInsideEventComponent', () => {
  let component: EventClosureDetailsInsideEventComponent;
  let fixture: ComponentFixture<EventClosureDetailsInsideEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventClosureDetailsInsideEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventClosureDetailsInsideEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
