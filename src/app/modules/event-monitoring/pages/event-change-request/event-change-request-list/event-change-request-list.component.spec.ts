import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventChangeRequestListComponent } from './event-change-request-list.component';

describe('EventChangeRequestListComponent', () => {
  let component: EventChangeRequestListComponent;
  let fixture: ComponentFixture<EventChangeRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventChangeRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventChangeRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
