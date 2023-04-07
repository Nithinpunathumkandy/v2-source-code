import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventChangeRequestDetailsComponent } from './event-change-request-details.component';

describe('EventChangeRequestDetailsComponent', () => {
  let component: EventChangeRequestDetailsComponent;
  let fixture: ComponentFixture<EventChangeRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventChangeRequestDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventChangeRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
