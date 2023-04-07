import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTypeModalComponent } from './event-type-modal.component';

describe('EventTypeModalComponent', () => {
  let component: EventTypeModalComponent;
  let fixture: ComponentFixture<EventTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventTypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
