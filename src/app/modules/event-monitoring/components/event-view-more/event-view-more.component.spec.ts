import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventViewMoreComponent } from './event-view-more.component';

describe('EventViewMoreComponent', () => {
  let component: EventViewMoreComponent;
  let fixture: ComponentFixture<EventViewMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventViewMoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventViewMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
