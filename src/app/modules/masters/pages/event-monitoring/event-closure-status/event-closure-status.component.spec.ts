import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventClosureStatusComponent } from './event-closure-status.component';

describe('EventClosureStatusComponent', () => {
  let component: EventClosureStatusComponent;
  let fixture: ComponentFixture<EventClosureStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventClosureStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventClosureStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
