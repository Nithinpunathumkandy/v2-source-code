import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventChangeRequestItemsComponent } from './event-change-request-items.component';

describe('EventChangeRequestItemsComponent', () => {
  let component: EventChangeRequestItemsComponent;
  let fixture: ComponentFixture<EventChangeRequestItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventChangeRequestItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventChangeRequestItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
