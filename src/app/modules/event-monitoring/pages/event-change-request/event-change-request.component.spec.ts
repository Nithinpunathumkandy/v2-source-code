import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventChangeRequestComponent } from './event-change-request.component';

describe('EventChangeRequestComponent', () => {
  let component: EventChangeRequestComponent;
  let fixture: ComponentFixture<EventChangeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventChangeRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
