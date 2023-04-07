import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventClosureInsideEventComponent } from './event-closure-inside-event.component';

describe('EventClosureInsideEventComponent', () => {
  let component: EventClosureInsideEventComponent;
  let fixture: ComponentFixture<EventClosureInsideEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventClosureInsideEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventClosureInsideEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
