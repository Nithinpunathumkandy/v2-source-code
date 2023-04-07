import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventChangeRequestStatusComponent } from './event-change-request-status.component';

describe('EventChangeRequestStatusComponent', () => {
  let component: EventChangeRequestStatusComponent;
  let fixture: ComponentFixture<EventChangeRequestStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventChangeRequestStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventChangeRequestStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
