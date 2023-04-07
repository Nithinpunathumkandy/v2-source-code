import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDeliverablesComponent } from './event-deliverables.component';

describe('EventDeliverablesComponent', () => {
  let component: EventDeliverablesComponent;
  let fixture: ComponentFixture<EventDeliverablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventDeliverablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDeliverablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
